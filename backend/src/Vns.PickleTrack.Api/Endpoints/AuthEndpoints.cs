using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Vns.PickleTrack.Application.Common;
using Vns.PickleTrack.Application.Routes;
using Vns.PickleTrack.Infrastructure.Persistence;

namespace Vns.PickleTrack.Api.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(
        this IEndpointRouteBuilder endpoints,
        IConfiguration configuration)
    {
        var group = endpoints.MapGroup(ApiRoutes.Auth)
            .WithTags("Authentication");

        group.MapPost("/login", async (
            LoginRequest request,
            PickleTrackDbContext dbContext,
            CancellationToken cancellationToken) =>
        {
            if (string.IsNullOrWhiteSpace(request.Account) ||
                string.IsNullOrWhiteSpace(request.Pin))
            {
                return Results.BadRequest(ApiEnvelope<object>.Fail(
                    "Vui lòng nhập tài khoản và mã PIN.",
                    new ApiError(
                        "validation_error",
                        null,
                        "Tài khoản và mã PIN là bắt buộc.")));
            }

            var account = request.Account.Trim().ToLowerInvariant();
            var user = await dbContext.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(
                    item => item.Username.ToLower() == account,
                    cancellationToken);

            if (user is null)
            {
                var member = await dbContext.Members
                    .AsNoTracking()
                    .FirstOrDefaultAsync(
                        item => item.PhoneNumber == request.Account.Trim(),
                        cancellationToken);

                if (member is not null)
                {
                    user = await dbContext.Users
                        .AsNoTracking()
                        .FirstOrDefaultAsync(
                            item => item.Id == member.UserId,
                            cancellationToken);
                }
            }

            if (user is null ||
                !user.IsActive ||
                !VerifyPin(request.Pin, user.PinHash))
            {
                return Results.Json(
                    ApiEnvelope<object>.Fail(
                        "Tài khoản hoặc mã PIN không đúng.",
                        new ApiError(
                            "invalid_credentials",
                            null,
                            "Thông tin đăng nhập không hợp lệ.")),
                    statusCode: StatusCodes.Status401Unauthorized);
            }

            var expiresAtUtc = DateTimeOffset.UtcNow.AddHours(8);
            var signingKey = configuration["Jwt:SigningKey"]
                ?? throw new InvalidOperationException("Jwt:SigningKey is required.");
            var credentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey)),
                SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.DisplayName),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };
            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                claims: claims,
                expires: expiresAtUtc.UtcDateTime,
                signingCredentials: credentials);

            return Results.Ok(ApiEnvelope<LoginResponse>.Ok(
                new LoginResponse(
                    new JwtSecurityTokenHandler().WriteToken(token),
                    expiresAtUtc,
                    user.Role.ToString().ToLowerInvariant(),
                    user.DisplayName)));
        });

        return endpoints;
    }

    private static string HashPin(string pin)
    {
        return Convert.ToHexString(
            SHA256.HashData(Encoding.UTF8.GetBytes(pin)));
    }

    private static bool VerifyPin(string pin, string storedHash)
    {
        var actual = Encoding.UTF8.GetBytes(HashPin(pin));
        var expected = Encoding.UTF8.GetBytes(storedHash);
        return actual.Length == expected.Length &&
            CryptographicOperations.FixedTimeEquals(actual, expected);
    }
}

public sealed record LoginRequest(string Account, string Pin);

public sealed record LoginResponse(
    string AccessToken,
    DateTimeOffset ExpiresAtUtc,
    string Role,
    string DisplayName);
