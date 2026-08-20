import { Button, Box, Container, Stack, Alert } from "@mui/material";
import { useRouter } from "next/router";

import React from "react";
import Logo from "../assets/RMA-Logo_Full.png";
import Image from "next/image";
const Login = () => {
  const router = useRouter();
  const { error } = router.query;

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 18,
          marginBottom: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Image src={Logo} alt="RMA Logo" width={400} height={200} />

        {error && (
          <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
            Login failed, please try again
          </Alert>
        )}

        <Button
          sx={{ mt: 4 }}
          size="large"
          variant="contained"
          href={`${router.basePath}/api/auth/login`}
        >
          Sign in
        </Button>

        <Stack>
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <Button variant="contained" onClick={() => signIn()}>
            Sign in
          </Button> */}
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default Login;
