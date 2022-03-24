import { Box } from '@mui/material'
import React from 'react'

export const ParentToCard = (props) => {
  const { children, window } = props
  // if (typeof window === "undefined") return
  return <Card text='hello world'>pass your other content into card here</Card>
}

export const Card = ({ text, children }) => {
  return (
    <Box
      sx={{
        width: {
          xs: 200,
          md: 500
        },
        height: 469,
        flexGrow: 0,
        m: 4,
        p: 4,
        color: (theme) => theme.palette.text.secondary,
        borderRadius: 3,
        boxShadow:
          '1px 0 5px 0 rgba(0, 0, 0, 0.43), inset 0 -4.5px 0 0 var(--style-secondary-color), inset 0 -1px 0 0 rgba(0, 0, 0, 0.52)',
        backgroundColor: (theme) => theme.palette.text.primary
      }}
    >
      {text}
      {children}
    </Box>
  )
}
export default Card
