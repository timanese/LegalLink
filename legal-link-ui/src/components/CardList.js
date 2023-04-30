import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

export default function CardList(props) {
  const { rowData } = props;
  const cards = [
    {
      title: "Description",
      items: [rowData?.gradeExplanation],
    },
    {
      title: "Green",
      items: rowData?.greenFlags,
    },
    {
      title: "Red",
      items: rowData?.redFlags,
    },
  ];

  return (
    <Stack direction="row" spacing={2}>
      {rowData === undefined ? (
        <p>Currently Unavailable</p>
      ) : (
        cards.map((card, index) => (
          <Card key={index} sx={{ width: "33%" }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {card.title}
              </Typography>
              <Typography sx={{ mt: 1 }} variant="body2" color="text.secondary">
                <ul>
                  {card.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Stack>
  );
}
