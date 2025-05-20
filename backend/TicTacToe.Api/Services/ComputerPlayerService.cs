using Microsoft.EntityFrameworkCore;

namespace TicTacToe.Api.Services
{
    public class ComputerPlayerService : IPlayerService
    {
        public bool MakeMove(Player player, ref Position position, IBoardService board)
        {
            // get array of valid moves
            var validMoves = board.GetBoard().Select((player, index) => new { player, index }).Where(x => x.player == Player.PLAYER_NONE);
            if (validMoves.Count() == 0) return false;

            Random random = new Random();
            var computerMove = random.Next(validMoves.Count() - 1);
            position = (Position)validMoves.ElementAt(computerMove).index;

            board.SetPosition(player, position);

            return true;
        }
    }
}