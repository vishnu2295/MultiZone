import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import useToken from "hooks/useToken";
import { useMutation, useQueryClient } from "react-query";
import { nodeSa } from "src/AxiosParams";

const RemoveBrokerageDialog = ({ user }) => {
  const [open, setOpen] = useState(false);
  const accessToken = useToken();
  const queryClient = useQueryClient();

  const removeBrokerageMutation = useMutation(
    async () => {
      const response = await axios.patch(
        `${nodeSa}/auth0/user/${user?.user_id}`,
        {
          user_metadata: {
            ...user.user_metadata,
            BrokerageIds: [],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["getUserById", user?.user_id]);
        queryClient.invalidateQueries(`getUserById${user?.user_id}`);
        setOpen(false);
      },
    }
  );

  return (
    <React.Fragment>
      <Button color="warning" onClick={() => setOpen(true)}>
        Remove Brokerage access
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="remove-brokerage-dialog-title"
        aria-describedby="remove-brokerage-dialog-description"
      >
        <DialogTitle id="remove-brokerage-dialog-title">
          {"Confirm Brokerage Removal"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="remove-brokerage-dialog-description">
            Are you sure you want to remove this brokerage from the user&apos;s
            profile?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => removeBrokerageMutation.mutate()}
            color="error"
            disabled={removeBrokerageMutation.isLoading}
          >
            {removeBrokerageMutation.isLoading ? "Removing..." : "Remove"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default RemoveBrokerageDialog;
