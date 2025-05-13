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
        public async Task<IActionResult> GetBoard()
        {
            var board = await _gameService.GetBoard();
            return Ok(board);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteBoard()
        {
            var reset = await _gameService.ResetBoard();
            return Ok(reset);
        }

        [HttpPut("{player}/{move}")]
        public async Task<IActionResult> MakeMove(Player player, Position move)
        {
            var result = await _gameService.MakeMove(player, move);
            return Ok(result);
        }
    }
}