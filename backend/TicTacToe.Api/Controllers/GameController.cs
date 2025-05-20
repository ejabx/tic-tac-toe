using Microsoft.AspNetCore.Mvc;
using TicTacToe.Api.Services;

namespace TicTacToe.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly IGameService _gameService;

        public GameController(IGameService gameService)
        {
            _gameService = gameService;
        }

        [HttpGet("board")]
        public Task<IActionResult> GetBoard()
        {
            var board = _gameService.GetBoard();
            return Task.FromResult<IActionResult>(Ok(board));
        }

        [HttpPost("reset")]
        public Task<IActionResult> DeleteBoard()
        {
            _gameService.ResetBoard();
            return Task.FromResult<IActionResult>(Ok(true));
        }

        [HttpPost("move/{player}/{position}")]
        public Task<IActionResult> MakeMove(Player player, Position position)
        {
            var result = _gameService.MakeMove(player, position);
            return Task.FromResult<IActionResult>(Ok(result));
        }

        [HttpPost("switch-to-computer/{player}")]
        public Task<IActionResult> SwitchToComputer(Player player)
        {
            _gameService.SwitchToComputer(player);
            return Task.FromResult<IActionResult>(Ok(true));
        }
    }
}