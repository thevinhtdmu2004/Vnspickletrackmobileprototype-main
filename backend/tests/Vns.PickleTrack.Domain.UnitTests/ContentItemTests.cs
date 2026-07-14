using Vns.PickleTrack.Domain.Entities;

namespace Vns.PickleTrack.Domain.UnitTests;

public sealed class ContentItemTests
{
    [Theory]
    [InlineData("approved", null)]
    [InlineData("rejected", "Nội dung cần bổ sung nguồn.")]
    public void Review_UpdatesStatusAndAudit(string status, string? reason)
    {
        var item = new ContentItem("Video", "video", "pending", null, "Nội dung");

        item.Review(status, "Admin Demo", reason);

        Assert.Equal(status, item.Status);
        Assert.Equal("Admin Demo", item.ReviewedByName);
        Assert.NotNull(item.ReviewedAtUtc);
        Assert.Equal(reason, item.RejectionReason);
    }

    [Fact]
    public void Review_RejectedWithoutReason_Throws()
    {
        var item = new ContentItem("Video", "video", "pending", null, "Nội dung");

        Assert.Throws<ArgumentException>(() => item.Review("rejected", "Admin Demo", null));
    }
}
