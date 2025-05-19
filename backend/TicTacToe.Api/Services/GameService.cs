using Microsoft.EntityFrameworkCore;

namespace TicTacToe.Api.Services
{
    public interface IGameService
    {
        Player[] GetBoard();

        void ResetBoard();

        MatchResult MakeMove(Player player, Position move);
    }

    public class GameService : IGameService
    {
        private readonly IBoardService _boardService;
        private readonly IPlayerService _playerService;

        public GameService(IBoardService boardService, IPlayerService playerService)
        {
            _boardService = boardService;
            _playerService = playerService;
        }

        public Player[] GetBoard()
        {
            return _boardService.GetBoard();
        }

        public void ResetBoard()
        {
            _boardService.ResetBoard();
        }

        public MatchResult MakeMove(Player player, Position position)
        {
            _playerService.MakeMove(player, position, _boardService);
            return _boardService.EvalWinner(player, position);
        }
    }
}