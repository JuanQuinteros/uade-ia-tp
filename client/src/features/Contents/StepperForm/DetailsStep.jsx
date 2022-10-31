import {
  contentAPI,
  CONTENT_DEFAULT_VALUES,
  schemaShape
} from "@features/Contents";
import { DelayedAsyncSelect } from "@features/UI";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField, Unstable_Grid2 as Grid } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const {
  duration,
  director,
  writer,
  cast,
  genres,
  maturity_rating,
} = schemaShape;

const schema = z.object({
  duration,
  director,
  writer,
  cast,
  genres,
  maturity_rating,
});

const DEFAULT_VALUES = {
  duration: CONTENT_DEFAULT_VALUES.duration,
  director: CONTENT_DEFAULT_VALUES.director,
  writer: CONTENT_DEFAULT_VALUES.writer,
  cast: CONTENT_DEFAULT_VALUES.cast,
  genres: CONTENT_DEFAULT_VALUES.genres,
  maturity_rating: CONTENT_DEFAULT_VALUES.maturity_rating,
}

function loadGenresDelayed(searchText, callback) {
  contentAPI.fetchGenres(searchText).then((genres) => {
    callback(genres);
  });
}

function loadMaturityRatingsDelayed(searchText, callback) {
  contentAPI.fetchMaturityRatings(searchText).then((maturityRatings) => {
    callback(maturityRatings);
  });
}

export function DetailsStep({ active, onNextStep, onPreviousStep }) {

  const { control, getValues, formState, register, handleSubmit } = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(schema),
  });
  const { errors } = formState;

  function handlePreviousStep() {
    const formValues = getValues();
    onPreviousStep({ ...formValues });
  }

  function handleStepTwoSubmit(formValues) {
    onNextStep({ ...formValues });
  }

  return (
    <Box
      component="form"
      autoComplete="off"
      display={active ? undefined : 'none'}
      onSubmit={handleSubmit(handleStepTwoSubmit)}
    >
      <Grid container spacing={2} mt={1}>
        <Grid xs={12}>
          <TextField
            fullWidth
            required
            variant="outlined"
            label="Duración (minutos)"
            type="number"
            error={!!errors.duration}
            helperText={errors.duration?.message}
            {...register('duration', { valueAsNumber: true })}
          />
        </Grid>
        <Grid xs={12}>
        <TextField
            fullWidth
            required
            variant="outlined"
            label="Director"
            placeholder="Peter Jackson"
            error={!!errors.director}
            helperText={errors.director?.message}
            {...register('director')}
          />
        </Grid>
        <Grid xs={12}>
          <TextField
            fullWidth
            required
            variant="outlined"
            label="Escritor"
            placeholder="John Doe"
            error={!!errors.writer}
            helperText={errors.writer?.message}
            {...register('writer')}
          />
        </Grid>
        <Grid xs={12}>
          <TextField
            fullWidth
            // This is to avoid getting rendered on top of react-selects
            sx={{'& label': { zIndex: 0 }}}
            required
            variant="outlined"
            label="Elenco"
            placeholder="Viggo Mortensen, Orlando Bloom, Elijah Wood..."
            error={!!errors.cast}
            helperText={errors.cast?.message}
            {...register('cast')}
          />
        </Grid>
        <Grid xs={12}>
          <Controller
            name="genres"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <DelayedAsyncSelect
                placeholder="Géneros *"
                cacheOptions
                defaultOptions
                isMulti
                getOptionLabel={item => item.description}
                getOptionValue={item => item.id}
                fetchCallback={loadGenresDelayed}
                delay={1500}
                error={!!errors.genres}
                helperText={errors.genres?.message}
                {...field}
              />
            )}
          />
        </Grid>
        <Grid xs={12}>
          <Controller
            name="maturity_rating"
            control={control}
            render={({ field }) => (
              <DelayedAsyncSelect
                placeholder="Calificación de Madurez *"
                cacheOptions
                defaultOptions
                getOptionLabel={item => item.description}
                getOptionValue={item => item.id}
                fetchCallback={loadMaturityRatingsDelayed}
                delay={1500}
                error={!!errors.maturity_rating}
                helperText={errors.maturity_rating?.message}
                {...field}
              />
            )}
          />
        </Grid>
        <Grid xs={12} display="flex" justifyContent="space-between">
          <Button type="button" onClick={handlePreviousStep}>
            Anterior
          </Button>
          <Button variant="contained" type="submit">
            Siguiente
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
