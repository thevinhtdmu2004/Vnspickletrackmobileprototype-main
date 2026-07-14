using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Vns.PickleTrack.Api.Authorization;
using Vns.PickleTrack.Api.Endpoints;
using Vns.PickleTrack.Infrastructure;
using Vns.PickleTrack.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddProblemDetails();
builder.Services.AddOpenApi();
builder.Services.AddHealthChecks();
builder.Services.AddInfrastructure(builder.Configuration);

var jwtIssuer = GetRequiredSetting(builder.Configuration, "Jwt:Issuer");
var jwtAudience = GetRequiredSetting(builder.Configuration, "Jwt:Audience");
var jwtSigningKey = GetRequiredSetting(builder.Configuration, "Jwt:SigningKey");

if (Encoding.UTF8.GetByteCount(jwtSigningKey) < 32)
{
    throw new InvalidOperationException(
        "Jwt:SigningKey must contain at least 32 UTF-8 bytes.");
}

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSigningKey)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromSeconds(30),
            RoleClaimType = ClaimTypes.Role,
            NameClaimType = ClaimTypes.Name
        };
    });

builder.Services.AddAuthorizationBuilder()
    .AddPolicy(Policies.AdminOnly, policy => policy.RequireRole("Admin"))
    .AddPolicy(Policies.CoachOnly, policy => policy.RequireRole("Coach"))
    .AddPolicy(Policies.CoachOrAdmin, policy => policy.RequireRole("Admin", "Coach"))
    .AddPolicy(Policies.MemberOnly, policy => policy.RequireRole("Member"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("MobileFrontend", policy =>
    {
        var origins = builder.Configuration
            .GetSection("Cors:AllowedOrigins")
            .Get<string[]>() ?? [];

        if (origins.Length == 0)
        {
            return;
        }

        policy.WithOrigins(origins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

await app.Services.InitializeDatabaseAsync(builder.Configuration);

app.UseExceptionHandler();
app.UseCors("MobileFrontend");
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapHealthChecks("/health/live");
app.MapSystemEndpoints();
app.MapAuthEndpoints(builder.Configuration);
app.MapAdminEndpoints();
app.MapCoachEndpoints();

app.Run();

static string GetRequiredSetting(IConfiguration configuration, string key)
{
    var value = configuration[key];
    return string.IsNullOrWhiteSpace(value)
        ? throw new InvalidOperationException($"{key} is required.")
        : value;
}

public partial class Program;
