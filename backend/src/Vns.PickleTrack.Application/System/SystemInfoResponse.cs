namespace Vns.PickleTrack.Application.System;

public sealed record SystemInfoResponse(
    string Service,
    string ApiVersion,
    string Runtime,
    DateTimeOffset ServerTimeUtc);
