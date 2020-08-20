import React from 'react';
import { Container, Typography, Box } from '@material-ui/core';
// import Container from '@material-ui/core/Container';
// import Typography from '@material-ui/core/Typography';
// import Box from '@material-ui/core/Box';
import pkg_info from '../package.json';

const v_text = 'v' + pkg_info.version;

export default function App() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          PyTron Dashboard
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center">
          {v_text}
        </Typography>
      </Box>
    </Container>
  );
}
