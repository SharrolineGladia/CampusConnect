import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, get } from 'firebase/database';
import styled from 'styled-components';

const TableContainer = styled.div`
  margin-top: 20px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
`;

const TableHeader = styled.th`
  background: rgba(94, 96, 206, 0.5);
  color: white;
  padding: 10px;
  text-align: left;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const TableCell = styled.td`
  padding: 10px;
  color: white;
`;

const RegisteredUsersTable = ({ eventId }) => {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      const db = getDatabase();
      const registrationsRef = ref(db, `events/${eventId}/registrations`);

      onValue(registrationsRef, async (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const registrationsArray = await Promise.all(
            Object.entries(data).map(async ([key, registration]) => {
              const userRef = ref(db, `users/${registration.userId}`);
              const userSnapshot = await get(userRef);
              const userData = userSnapshot.val();
              return {
                ...registration,
                userName: userData?.name || 'Anonymous',
                registrationNumber: userData?.registrationNumber || 'N/A'
              };
            })
          );
          setRegistrations(registrationsArray);
        } else {
          setRegistrations([]);
        }
      });
    };

    fetchRegistrations();
  }, [eventId]);

  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Registration Number</TableHeader>
            <TableHeader>Registration Date</TableHeader>
          </tr>
        </thead>
        <tbody>
          {registrations.map((registration, index) => (
            <TableRow key={index}>
              <TableCell>{registration.userName}</TableCell>
              <TableCell>{registration.userEmail}</TableCell>
              <TableCell>{registration.registrationNumber}</TableCell>
              <TableCell>{new Date(registration.timestamp).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default RegisteredUsersTable;