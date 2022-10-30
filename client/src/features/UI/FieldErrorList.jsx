import { List, ListItemText } from "@mui/material";

export function FieldErrorList({ errors }) {

  if(Object.keys(errors).length === 0) {
    return null;
  }

  return (
    <List>
      {Object.entries(errors).map(([field, { message }]) => (
        <ListItemText
          key={field}
          primary={field}
          primaryTypographyProps={{ color: 'error.main' }}
          secondary={message}
        />
      ))}
    </List>
  )
}
