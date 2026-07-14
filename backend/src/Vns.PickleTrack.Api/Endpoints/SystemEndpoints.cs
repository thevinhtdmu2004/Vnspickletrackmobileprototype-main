using Microsoft.EntityFrameworkCore;
using Vns.PickleTrack.Application.Common;
using Vns.PickleTrack.Application.Routes;
using Vns.PickleTrack.Application.System;
using Vns.PickleTrack.Infrastructure.Persistence;

namespace Vns.PickleTrack.Api.Endpoints;

public static class SystemEndpoints
{
    public static IEndpointRouteBuilder MapSystemEndpoints(
        this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup(ApiRoutes.System)
            .WithTags("System");

        group.MapGet("/info", () =>
            Results.Ok(ApiEnvelope<SystemInfoResponse>.Ok(
                new SystemInfoResponse(
                    "VNS PickleTrack API",
                    "v1",
                    $".NET {Environment.Version}",
                    DateTimeOffset.UtcNow))));

        group.MapGet("/database", async (
            PickleTrackDbContext dbContext,
            CancellationToken cancellationToken) =>
        {
            var canConnect = await dbContext.Database.CanConnectAsync(cancellationToken);
            return canConnect
                ? Results.Ok(ApiEnvelope<object>.Ok(new { status = "ready" }))
                : Results.Problem(
                    statusCode: StatusCodes.Status503ServiceUnavailable,
                    title: "Database unavailable");
        });

        return endpoints;
    }
}
