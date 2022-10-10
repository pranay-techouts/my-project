import React, { useEffect, useState } from "react";
import "./App.css";
import SearchBar from "material-ui-search-bar";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const endpoint = "https://api.github.com/graphql";

function App() {
  const [topic, setTopic] = useState("react");
  const [response, setResponse] = useState([]);

  const handleChange = (topic) => {
    setTopic(topic);
  };

  useEffect(() => {
    // calling api here and set response
    async function fetchData(topic) {
      const response = await axios({
        url: endpoint,
        data: {
          query: `
{
  topic(name: "${topic}") {
    id
    name
    stargazers{
        totalCount
    }
    relatedTopics{
        id 
        name
        stargazers{
            totalCount
        }

    }
  }
}

`,
        },
        method: "POST",
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_API_KEY,
        },
      })
        .then((response) =>
          setResponse(response?.data?.data?.topic.relatedTopics)
        )
        .catch((err) => {
          console.log(err);
          return err;
        });
    }
    fetchData(topic);
  }, [topic]);


  return (
    <div className="App">
      <header className="App-header">
        <h2>FE Take Home Project</h2>
      </header>
      <div style={{ margin: "1vh 20vw" }}>
        <SearchBar
          placeholder="Search Here"
          value={topic}
          onRequestSearch={(e) => handleChange(e)}
        />
      </div>

      <div>
        <TableContainer className="table">
          <Table style={{ width: "30%" }} >
            <TableHead>
              <TableRow>
                <TableCell>SubTopic</TableCell>
                <TableCell align="right">Stargazers</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {response.map((el, index) => (
                <TableRow key={index} onClick={() => handleChange(el.name)}>
                  <TableCell style={{ cursor: "pointer" }} >
                    {el.name}
                  </TableCell>
                  <TableCell align="right" key={index}>{el.stargazers.totalCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default App;
