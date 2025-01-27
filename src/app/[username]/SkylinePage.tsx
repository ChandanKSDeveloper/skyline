'use client';

import { FormControl, FormHelperText, FormLabel, Input, Skeleton, Stack, Typography } from "@mui/joy";
import SingleFoldPageUIWrapper from "../../components/SingleFoldPageUIWrapper";
import { Canvas } from "@react-three/fiber";
import { Vector3 } from "three";
import Skyline3d from "../../components/Skyline3D";
import { useSearchParams, useRouter } from 'next/navigation';
import { getFirstDayOfYearFromLastDay, structureTimelineByWeek } from "../../utils/generateContributionTimeline";
import { useEffect, useState } from "react";
import { GitHubContributionCalendar } from 'src/github-types';

interface SkylinePageProps {
	username: string;
	userContributionCalendar?: GitHubContributionCalendar;
	endDate: Date;
	error?: string;
}

export default function SkylinePage({ username, userContributionCalendar, endDate: initialEndDate, error }: SkylinePageProps) {
	const [timeline, setTimeline] = useState<number[][] | undefined>(undefined);
	const [errorMessage, setErrorMessage] = useState("");

	const currentDate = new Date();
	const minDate = '2008-01-01';
	const maxDate = `${currentDate.getFullYear()}-12-31`;
	const [endDate, setEndDate] = useState(initialEndDate);
	const [dateErr, setDateErr] = useState("");

	const searchParams = useSearchParams();
	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const enteredDate = new Date(e.target.value);
		const minDateObj = new Date(minDate)
		const maxDateObj = new Date(maxDate)
		setEndDate(enteredDate);
		if (enteredDate < minDateObj || enteredDate > maxDateObj) {
			// Show an error message or handle out-of-range input as needed
			const errMsg = `Valid dates: ${minDateObj.getFullYear()}-${maxDateObj.getFullYear()}`
			console.error(`Invalid date: out of range (${minDateObj.getFullYear()}-${maxDateObj.getFullYear()})`);
			setDateErr(errMsg);
		} else {
			setDateErr("")
			const newSearchParams = new URLSearchParams(searchParams);
			newSearchParams.set('endDate', e.target.value);
			router.push(`/${username}?${newSearchParams.toString()}`);
		}
	};

	useEffect(() => {
		if (userContributionCalendar)
			setTimeline(structureTimelineByWeek(userContributionCalendar));
	}, [userContributionCalendar]);

	useEffect(() => {
		if (error) {
			console.error("Server error:", error);
			setErrorMessage("Error fetching contributions. Please try again later.");
		}
	}, [error]);

	return (
		<SingleFoldPageUIWrapper>
			<Stack sx={{ width: '100%', height: '100%' }}>
				<Stack sx={{ display: 'flex', flexDirection: 'row', gap: 2, mx: 'auto' }}>
					<FormControl error={dateErr && dateErr !== "" ? true : false}>
						<FormLabel>Username:</FormLabel>
						<Input type="text" disabled value={username} />
					</FormControl>
					<FormControl error={dateErr && dateErr !== "" ? true : false}>
						<FormLabel>Start Date:</FormLabel>
						<Input type="date" disabled value={getFirstDayOfYearFromLastDay(endDate).toISOString().split('T')[0]} />
					</FormControl>
					<FormControl error={dateErr && dateErr !== "" ? true : false}>
						<FormLabel>End Date:</FormLabel>
						<Input
							type="date"
							slotProps={{
								input: {
									min: minDate,
									max: maxDate,
								}
							}}
							value={endDate.toISOString().split('T')[0]}
							onChange={handleChange}
						/>
						{dateErr && dateErr !== "" && (
							<FormHelperText>{dateErr}</FormHelperText>
						)}
					</FormControl>
				</Stack>
				{(errorMessage && errorMessage !== "") ? (
					<Typography color="danger" level="title-lg">{errorMessage}</Typography>
				) : null}
				{timeline ? (
					<Canvas>
						{/* <ThreeDObject /> */}
						<pointLight position={new Vector3(10, 10, 10)} intensity={500} />
						<ambientLight intensity={0.5} />
						<Skyline3d data={timeline} position={[0, -2, -5]} />
					</Canvas>
				) : (
					<Skeleton variant="rectangular" animation="wave" sx={{
						width: '100%',
						aspectRatio: 16 / 9,
					}} />
				)}
			</Stack>
		</SingleFoldPageUIWrapper>
	);
}