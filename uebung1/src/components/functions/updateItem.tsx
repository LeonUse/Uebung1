import { useLocation } from "react-router-dom";
import * as React from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close'
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';


export default function UpdateItem() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { list1 } = state || {};

    console.log("Daten updateItem", list1);
    const [name, setName] = React.useState<RezeptName>({ name: list1.name });
    const [dauer, setDauer] = React.useState<RezeptDauer>({ dauer: list1.dauer });
    const [kosten, setKosten] = React.useState<RezeptKosten>({ kosten: list1.kosten });
    const [anleitung, setAnleitung] = React.useState<RezeptAnleitung>({ anleitung: list1.anleitung });
    const [change, setChange] = React.useState<boolean>(true);
    const [buttonText, setButtonText] = React.useState<string>("Bearbeiten");
    const [error, setError] = React.useState<boolean>(false);
    const [success, setSuccess] = React.useState<boolean>(false);

    const handleChangeName = (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setName({ ...name, [prop]: event.target.value });
        console.log(name.name);
        console.log(name);

    };

    const handleChangeDauer = (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setDauer({ ...dauer, [prop]: event.target.value });

    };
    const handleChangeKosten = (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setKosten({ ...kosten, [prop]: event.target.value });

    };
    const handleChangeAnleitung = (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setAnleitung({ ...anleitung, [prop]: event.target.value });

    };

    const handleBack = useCallback(() => navigate('/list 2', { replace: true }), [navigate]);

    const startUpdate = () => {
        setChange(!change);
        if (!change) {
            setButtonText("Bearbeiten");
        } else {
            setButtonText("Bearbeiten beenden")
        }
    };

    const speichern = async () => {

        let dauern: number = +dauer.dauer;
        let kostenn: number = +kosten.kosten;

        const values = {
            id: list1.id,
            name: name.name,
            dauer: dauern,
            kosten: kostenn,
            anleitung: anleitung.anleitung,
        }

        console.log(values);
        if (name.name != "" && dauern > 0 && kostenn > 0 && anleitung.anleitung != "") {
            const response = await fetch("http://localhost:9000/updateRezept", { method: 'PATCH', body: JSON.stringify(values) }).then((response) => response.json());
            setError(false);
            setSuccess(true);
            handleBack();
        } else {
            setSuccess(false);
            setError(true);
            console.log("Speichern fehlgeschlagen");
        }
    };

    return (
        <>
            <h1>Schau dir dein Rezept an :)</h1>
            <h2>Du kannst es auch bearbeiten</h2>
            <Box
                sx={{
                    paddingTop: 10,
                    width: 1200,
                    maxWidth: '100%',
                }}
            >
                <div>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <OutlinedInput
                            id="name"
                            value={name.name}
                            onChange={handleChangeName('name')}
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                                'aria-label': 'name',
                                readOnly: change,
                            }}
                        />
                        <FormHelperText id="outlined-weight-helper-text">Name</FormHelperText>
                    </FormControl>

                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <OutlinedInput
                            id="dauer"
                            value={dauer.dauer}
                            onChange={handleChangeDauer('dauer')}
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                                'aria-label': 'dauer',
                                readOnly: change,
                            }}
                        />
                        <FormHelperText id="outlined-weight-helper-text">Dauer</FormHelperText>
                    </FormControl>

                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <OutlinedInput
                            id="kosten"
                            value={kosten.kosten}
                            onChange={handleChangeKosten('kosten')}
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                                'aria-label': 'kosten',
                                readOnly: change,
                            }}
                        />
                        <FormHelperText id="outlined-weight-helper-text">Kosten</FormHelperText>
                    </FormControl>

                    <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
                        <OutlinedInput
                            id="anleitung"
                            value={anleitung.anleitung}
                            onChange={handleChangeAnleitung('anleitung')}
                            aria-describedby="outlined-weight-helper-text"
                            multiline
                            minRows={10}
                            maxRows={20}
                            inputProps={{
                                'aria-label': 'anleitung',
                                readOnly: change,
                            }}
                        />
                        <FormHelperText id="outlined-weight-helper-text">Anleitung</FormHelperText>
                    </FormControl>
                </div>
            </Box>
            {/* <Link to="/list 1"> */}
            <Button variant="contained" onClick={(e) => startUpdate()}>{buttonText}</Button>
            <Button style={{ marginLeft: 50 }} variant="contained" onClick={(e) => speichern()}>Speichern</Button>
            {/* </Link> */}
            <>
                <Box sx={{ width: '100%' }}>
                    <Collapse in={error}>
                        <Alert
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setError(false);
                                    }}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            sx={{ mb: 2, marginTop: 5 }}
                            variant="outlined" severity="warning"
                        >
                            Bitte füll alle Felder aus.
                        </Alert>
                    </Collapse>
                    <Collapse in={success}>
                        <Alert
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setSuccess(false);
                                    }}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            sx={{ mb: 2, marginTop: 5 }}
                            variant="outlined"
                        >
                            Erfolgreich!
                        </Alert>
                    </Collapse>
                </Box>
            </>
        </>
    )
}