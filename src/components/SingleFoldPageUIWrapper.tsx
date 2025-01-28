import Sheet from '@mui/joy/Sheet';
import { PropsWithChildren } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

function SingleFoldPageUIWrapper(props: PropsWithChildren) {
	return (
		<Sheet variant='soft' sx={{
			width: '100%',
			height: '100vh',
			mx: 'auto', // margin left & right
			display: 'flex',
			flexDirection: 'column',
			gap: '2px',
			boxSizing: 'border-box',
			textAlign: 'center'
		}}>
			<Header />
			{props.children}
			<Footer />
		</Sheet>
	)
}

export default SingleFoldPageUIWrapper;