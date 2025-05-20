using Microsoft.EntityFrameworkCore;

namespace TicTacToe.Api.Services
{
    public enum Player
    {
        PLAYER_NONE,
        PLAYER_X,
        PLAYER_O,
    }

    public interface IPlayerService
    {
        bool MakeMove(Player player, ref Position position, IBoardService board);
    }

    public class HumanPlayerService : IPlayerService
    {
        public bool MakeMove(Player player, ref Position position, IBoardService board)
        {
            board.SetPosition(player, position);
            return true;
        }
    }
}