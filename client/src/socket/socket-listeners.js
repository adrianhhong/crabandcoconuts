export const socketListneners = (socket) => {
  socket.on('updatePlayerList', ({ usernames }) => {
    console.log(usernames);
  });

  // socker.on('Error: Incorrect password!', () => {
  //   console.log('Error: Incorrect password!');
  //   room.setState({
  //     error: {
  //       title: 'INCORRECT PASSWORD',
  //       content: 'Sorry, incorrect password for the room. Try again',
  //     },
  //   });
  // });

  // socker.on('Error: Create a room first!', () => {
  //   console.log('Error: Create a room first!');
  //   room.setState({
  //     error: {
  //       title: 'ROOM NOT FOUND',
  //       content:
  //         'Sorry, requested Room does not exist. Create a New Room or enter the correct ROOM ID',
  //     },
  //   });
  // });

  // socker.on('Error: Room already created. Join the room!', () => {
  //   console.log(
  //     'Error: Create a new room again or Join existing one!',
  //   );
  //   room.setState({
  //     error: {
  //       title: 'ROOM ALREADY PRESENT',
  //       content:
  //         'Sorry, requested Room already present, Join the existing room or Create a new room again',
  //     },
  //   });
  // });
};
