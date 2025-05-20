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
        private readonly (IPlayerService, IPlayerService) _playerServices;

        public GameService(IBoardService boardService)
        {
            _boardService = boardService;
            _playerServices = (new HumanPlayerService(), new ComputerPlayerService());
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
            if (player == Player.PLAYER_X)
                _playerServices.Item1.MakeMove(player, ref position, _boardService);
            else
                _playerServices.Item2.MakeMove(player, ref position, _boardService);

            return _boardService.EvalWinner(player, position);
        }
    }
}