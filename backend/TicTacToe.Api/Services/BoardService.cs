using Microsoft.EntityFrameworkCore;

namespace TicTacToe.Api.Services
{
    public enum Position
    {
        POSITION_1,
        POSITION_2,
        POSITION_3,
        POSITION_4,
        POSITION_5,
        POSITION_6,
        POSITION_7,
        POSITION_8,
        POSITION_9,
    }

    public readonly struct MatchResult
    {
        public MatchResult(bool win, bool draw)
        {
            isWin = win;
            isDraw = draw;
        }

        public bool isWin { get; init; }
        public bool isDraw { get; init; }
    }

    public interface IBoardService
    {
        Player[] GetBoard();

        void ResetBoard();

        void SetPosition(Player player, Position position);

        MatchResult EvalWinner(Player player, Position position);
    }

    public class BoardService : IBoardService
    {
        private Player[] _positions = { Player.PLAYER_NONE, Player.PLAYER_NONE, Player.PLAYER_NONE, Player.PLAYER_NONE, Player.PLAYER_NONE, Player.PLAYER_NONE, Player.PLAYER_NONE, Player.PLAYER_NONE, Player.PLAYER_NONE };

        public Player[] GetBoard()
        {
            return _positions;
        }

        public void ResetBoard()
        {
            _positions = Enumerable.Range(0, 9).Select(n => Player.PLAYER_NONE).ToArray();
        }

        public void SetPosition(Player player, Position position) => _positions[(int)position] = player;

        public MatchResult EvalWinner(Player player, Position position)
        {
            bool isWin = false;
            bool isDraw = false;

            var row = (int)position / 3;
            var col = (int)position % 3;

            // test row
            if (_positions[row * 3 + 0] == player && _positions[row * 3 + 1] == player && _positions[row * 3 + 2] == player) isWin = true;

            // test col
            if (_positions[0 * 3 + col] == player && _positions[1 * 3 + col] == player && _positions[2 * 3 + col] == player) isWin = true;

            // test center
            if (_positions[0] == player && _positions[4] == player && _positions[8] == player) isWin = true;
            if (_positions[2] == player && _positions[4] == player && _positions[6] == player) isWin = true;

            isDraw = _positions.Count(pos => pos != Player.PLAYER_NONE) == 9;

            return new MatchResult(isWin, isDraw);
        }
    }
}