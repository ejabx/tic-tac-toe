using Microsoft.EntityFrameworkCore;

namespace TicTacToe.Api.Services
{
    public interface IGameService
    {
        Player[] GetBoard();

        void ResetBoard();

        MatchResult MakeMove(Player player, Position move);

        void SwitchToComputer(Player player);
    }

    public class GameService : IGameService
    {
        private readonly IBoardService _boardService;
        private (IPlayerService, IPlayerService) _playerServices;

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

        public void SwitchToComputer(Player player)
        {
            switch (player)
            {
                case Player.PLAYER_NONE:
                    _playerServices = (new HumanPlayerService(), new HumanPlayerService());
                    break;
                case Player.PLAYER_X:
                    _playerServices = (new ComputerPlayerService(), new HumanPlayerService());
                    break;
                case Player.PLAYER_O:
                    _playerServices = (new HumanPlayerService(), new ComputerPlayerService());
                    break;
            }
        }
    }
}