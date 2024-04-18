import React, { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function Home() {

	useEffect(() => {
		document.getElementById("loading").style.display = "none";
	})

	return (
		<div class="container">
			<div class="row justify-content-md-center mt-5">
				<div class="col-12 my-5">
					<h1 class="text-center" style={{ fontSize: "200px" }}>404</h1>
				</div>
				<div class="col-12 my-4 text-center">
					<h1>Page not found</h1>
				</div>
				<div class="col-12 text-center mt-5">
					<a href="/" class="link-dark">กลับหน้าหลัก</a>
				</div>
			</div>
		</div>

	);
}