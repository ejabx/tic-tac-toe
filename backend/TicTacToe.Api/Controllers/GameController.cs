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

        [HttpGet]
        public Task<IActionResult> GetBoard()
        {
            var board = _gameService.GetBoard();
            return Task.FromResult<IActionResult>(Ok(board));
        }

        [HttpDelete]
        public Task<IActionResult> DeleteBoard()
        {
            _gameService.ResetBoard();
            return Task.FromResult<IActionResult>(Ok(true));
        }

        [HttpPut("{player}/{move}")]
        public Task<IActionResult> MakeMove(Player player, Position move)
        {
            var result = _gameService.MakeMove(player, move);
            return Task.FromResult<IActionResult>(Ok(result));
        }
    }
}