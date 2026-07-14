using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Vns.PickleTrack.Infrastructure.Persistence;

public static class DatabaseInitializer
{
    public static async Task InitializeDatabaseAsync(
        this IServiceProvider services,
        IConfiguration configuration,
        CancellationToken cancellationToken = default)
    {
        var applyMigrations = bool.TryParse(
            configuration["Database:ApplyMigrationsOnStartup"],
            out var enabled) && enabled;

        if (!applyMigrations)
        {
            return;
        }

        await using var scope = services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<PickleTrackDbContext>();
        await dbContext.Database.MigrateAsync(cancellationToken);

        var seedDemoData = bool.TryParse(
            configuration["Database:SeedDemoData"],
            out var shouldSeed) && shouldSeed;

        if (seedDemoData)
        {
            await DemoDataSeeder.SeedAsync(dbContext, cancellationToken);
        }
    }
}
