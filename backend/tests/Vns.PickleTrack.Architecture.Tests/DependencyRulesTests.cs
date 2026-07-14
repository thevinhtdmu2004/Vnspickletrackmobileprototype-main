using NetArchTest.Rules;
using Vns.PickleTrack.Application.Common;
using Vns.PickleTrack.Domain.Common;
using Vns.PickleTrack.Infrastructure.Persistence;

namespace Vns.PickleTrack.Architecture.Tests;

public sealed class DependencyRulesTests
{
    [Fact]
    public void Domain_DoesNotDependOnOuterLayers()
    {
        var result = Types.InAssembly(typeof(Entity).Assembly)
            .ShouldNot()
            .HaveDependencyOnAny(
                "Vns.PickleTrack.Application",
                "Vns.PickleTrack.Infrastructure",
                "Vns.PickleTrack.Api")
            .GetResult();

        Assert.True(result.IsSuccessful);
    }

    [Fact]
    public void Application_DoesNotDependOnInfrastructureOrApi()
    {
        var result = Types.InAssembly(typeof(ApiEnvelope<>).Assembly)
            .ShouldNot()
            .HaveDependencyOnAny(
                "Vns.PickleTrack.Infrastructure",
                "Vns.PickleTrack.Api")
            .GetResult();

        Assert.True(result.IsSuccessful);
    }

    [Fact]
    public void Infrastructure_DoesNotDependOnApi()
    {
        var result = Types.InAssembly(typeof(PickleTrackDbContext).Assembly)
            .ShouldNot()
            .HaveDependencyOn("Vns.PickleTrack.Api")
            .GetResult();

        Assert.True(result.IsSuccessful);
    }
}
