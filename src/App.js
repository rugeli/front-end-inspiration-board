import "./App.css";
import CardList from "./components/CardList";
import axios from "axios";
import CardForm from "./components/CardForm";
import BoardForm from "./components/BoardForm";
import { useState, useEffect } from "react";
import Board from "./components/Board";

function App() {
  const URL = "https://team-green-inspo.herokuapp.com";
  const [boardData, setBoardData] = useState([]);
  const [chosenBoard, setChosenBoard] = useState({});
  const [cardData, setCardData] = useState([]);
  // Don't need useEffect for cardData because it only loads when a board is selected

  const createNewCard = ({ message, board_id }) => {
    axios
      .post(`${URL}/boards/${board_id}/cards`, {
        message: message,
      })
      .then((response) => {
        console.log("making new card");
        console.log(response);

        const nextId = response.data.card.id;
        console.log(nextId);
        const newCard = {
          card_id: nextId,
          board_id: board_id,
          message: message,
          likes: 0,
        };
        const newCardData = [...cardData];
        newCardData.push(newCard);
        setCardData(newCardData);
      })
      .catch((error) => {
        console.log(error);
        alert("Couldn't make new card. Enter a message.");
      });
  };

  const deleteOneCard = (card_id) => {
    axios
      .delete(`${URL}/cards/${card_id}`)
      .then(() => {
        const newCardData = cardData.filter((card) => card_id !== card.card_id);
        setCardData(newCardData);
      })
      .catch((error) => {
        alert("Couldn't delete card. Please refresh and try again.");
        console.log("delete fail");
        console.log(error);
      });
  };

  const likeOneCard = (card_id) => {
    axios
      .patch(`${URL}/cards/${card_id}`)
      .then((response) => {
        const newCardData = cardData.map((card) => {
          if (card.card_id === card_id) {
            card.likes++;
          }
          return card;
        });
        console.log(newCardData);
        setCardData(newCardData);
      })
      .catch((error) => {
        console.log(error);
        console.log("could not update like count");
      });
  };

  const getCardDataFromAPI = (board_id) => {
    axios
      .get(`${URL}/boards/${board_id}/cards`)
      .then((response) => {
        setCardData(response.data.cards);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get(`${URL}/boards`)
      .then((response) => {
        setBoardData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const createNewBoard = (newBoard) => {
    axios
      .post(`${URL}/boards`, newBoard)
      .then((response) => {
        console.log(response);
        newBoard.id = response.data.board.id;
        let newBoardData = [...boardData];
        newBoardData.push(newBoard);
        setBoardData(newBoardData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectBoard = (board) => {
    setChosenBoard(board);
    getCardDataFromAPI(board.id);
  };

  const boardTitles = boardData.map((board) => {
    return (
      <li key={board.id}>
        <Board board={board} onBoardSelect={selectBoard}></Board>
      </li>
    );
  });

  const [isBoardFormVisible, setIsBoardFormVisible] = useState(true);
  const toggleBoardForm = () => {
    setIsBoardFormVisible(!isBoardFormVisible);
  };

  return (
    <body>
      <header>
        <h1>Team Green's Board</h1>
      </header>
      <main>
        <section>
          <h2>Boards</h2>
          <ul>{boardTitles}</ul>
        </section>
        <section>
          <h2>Selected Board</h2>
          <p>
            {chosenBoard.id
              ? `${chosenBoard.title} - ${chosenBoard.owner}`
              : "Please select a board"}
          </p>
        </section>
        <section>
          {isBoardFormVisible ? (
            <BoardForm createBoardCallback={createNewBoard}></BoardForm>
          ) : (
            ""
          )}
          <span onClick={toggleBoardForm}>
            {isBoardFormVisible ? "Hide New Board Form" : "Show New Board Form"}
          </span>
        </section>
        <div>
          <CardList
            cardsData={cardData}
            deleteOneCardCallback={deleteOneCard}
            likeOneCardCallback={likeOneCard}
          />
        </div>
        <CardForm
          createNewCardCallback={createNewCard}
          board_id={chosenBoard.id}
        ></CardForm>
      </main>
      <footer>
        <p>Made by: Ruge, Megan, Diana, and Lin</p>
      </footer>
    </body>
  );
}

export default App;
