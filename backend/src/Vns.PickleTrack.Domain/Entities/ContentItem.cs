using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class ContentItem : Entity
{
    private ContentItem() { }

    public ContentItem(
        string title,
        string contentType,
        string status,
        Guid? packageId,
        string summary,
        string createdByName = "Hệ thống")
    {
        Title = title;
        ContentType = contentType;
        Status = status;
        PackageId = packageId;
        Summary = summary;
        CreatedByName = createdByName;
    }

    public string Title { get; private set; } = string.Empty;
    public string ContentType { get; private set; } = string.Empty;
    public string Status { get; private set; } = string.Empty;
    public Guid? PackageId { get; private set; }
    public string Summary { get; private set; } = string.Empty;
    public string CreatedByName { get; private set; } = string.Empty;
    public string? ReviewedByName { get; private set; }
    public DateTimeOffset? ReviewedAtUtc { get; private set; }
    public string? RejectionReason { get; private set; }

    public void Review(string status, string reviewedByName, string? rejectionReason)
    {
        if (status is not ("approved" or "rejected"))
        {
            throw new ArgumentOutOfRangeException(nameof(status));
        }

        if (Status != "pending")
        {
            throw new InvalidOperationException("Only pending content can be reviewed.");
        }

        if (string.IsNullOrWhiteSpace(reviewedByName))
        {
            throw new ArgumentException("Reviewer is required.", nameof(reviewedByName));
        }

        if (status == "rejected" && string.IsNullOrWhiteSpace(rejectionReason))
        {
            throw new ArgumentException("Rejection reason is required.", nameof(rejectionReason));
        }

        Status = status;
        ReviewedByName = reviewedByName.Trim();
        ReviewedAtUtc = DateTimeOffset.UtcNow;
        RejectionReason = status == "rejected" ? rejectionReason!.Trim() : null;
        MarkUpdated();
    }
}
