import React from 'react';
import {
  MDBFooter,
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn
} from 'mdb-react-ui-kit';
import { useTheme } from '@mui/material/styles';

export default function Footer() {
    const theme = useTheme();

  return (
    <MDBFooter className='text-center text-white' style={{ backgroundColor: theme.palette.background.sidebar }}>
      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © 2025-2026 Copyright:
        <a className='text-white' href='https://deebehygh.com/'>
          deebehygh.com
        </a>
      </div>
    </MDBFooter>
  );
}