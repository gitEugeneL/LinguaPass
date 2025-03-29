using IdentityApi.Tools;
using MediatR;

namespace IdentityApi.Features.GenerateCode;

public sealed record Command(string Email) : IRequest<Result<Output>>;