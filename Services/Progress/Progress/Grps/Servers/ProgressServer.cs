using Common.GrpcProtos;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using Progress.Data;
using Progress.Domain.Entities;
using Shared.Domain.Enums;

namespace Progress.Grps.Servers;

public class ProgressServer(AppDbContext dbContext) : Progresses.ProgressesBase
{
    public const string InvalidUser = "Invalid userId format";

    private async Task<CustomerProgress> FindUserProgress(CheckStatusRequest request)
    {
        if (!Guid.TryParse(request.UserId, out var parseUserId))
            throw new RpcException(new Status(StatusCode.Unavailable, InvalidUser));

        var userStep = await dbContext
            .CustomerProgress
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.UserId == parseUserId);

        if (userStep is null)
            throw new RpcException(new Status(StatusCode.Unavailable, InvalidUser));

        return userStep;
    }

    public override async Task<CheckStatusResponse> CheckStatusToSendApplication(
        CheckStatusRequest request,
        ServerCallContext context)
    {
        var progress = await FindUserProgress(request);

        return progress.Step == Steps.SubmissionDocuments
            ? new CheckStatusResponse { IsStatusValid = true }
            : new CheckStatusResponse { IsStatusValid = false };
    }

    public override async Task<CheckStatusResponse> CheckStatusToCompleteApplication(
        CheckStatusRequest request,
        ServerCallContext context)
    {
        var progress = await FindUserProgress(request);

        return progress.Step == Steps.ReviewProcessing
            ? new CheckStatusResponse { IsStatusValid = true }
            : new CheckStatusResponse { IsStatusValid = false };
    }
}