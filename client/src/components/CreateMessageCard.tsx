import React, { JSX, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ApiRoutes } from '../util/routes.ts';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../api.ts';
import { useError } from '../hooks/useError.ts';
import { useAuth } from '../hooks/useAuth.ts';

interface CreateMessageCardProps {
  hideCard: () => void;
  disussionId: string;
}

interface CreateMessage {
  content: string;
  senderId: string;
  discussionId: string;
}

export function CreateMessageCard(props: CreateMessageCardProps): JSX.Element {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const { setError } = useError();
  const { user } = useAuth();

  const mutate = useMutation({
    mutationFn: async (data: CreateMessage) => {
      await apiClient.put(ApiRoutes.message.create, data);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>, message: string) => {
    event.preventDefault();

    mutate.mutate(
      {
        content: message,
        senderId: user!!.id,
        discussionId: props.disussionId,
      },
      {
        onSuccess: () => {
          props.hideCard();
        },
        onError: (error) => {
          props.hideCard();
          setError(error.message);
        },
      },
    );
  };

  return (
    <Box
      sx={{
        width: '50vw',
        height: '50vh',
        p: 3,
        mx: 'auto',
        border: '1px solid black',
        borderRadius: 10,
      }}
    >
      <Typography variant={'h4'}>{t('createNewDiscussionMessage')}</Typography>
      <Box
        sx={{
          mx: 'auto',
          borderTop: '1px solid black',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
        component={'form'}
        onSubmit={(e) => handleSubmit(e, message)}
        noValidate
        autoComplete="off"
      >
        <TextField
          multiline={true}
          minRows={10}
          sx={{ width: '100%' }}
          onChange={(event) => setMessage(event.target.value)}
        />
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 10,
          }}
        >
          <Button variant={'outlined'} onClick={() => props.hideCard()}>
            {t('cancel')}
          </Button>
          <Button variant={'contained'} type={'submit'}>
            {t('send')}
          </Button>
        </div>
      </Box>
    </Box>
  );
}
