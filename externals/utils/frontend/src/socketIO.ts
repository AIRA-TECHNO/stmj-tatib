// import { io, Socket } from "socket.io-client";

// export const initSocket = (() => {
//   const socketHost = process.env.NEXT_PUBLIC_SOCKET_HOST;
//   const path = process.env.NEXT_PUBLIC_SOCKET_PATH;
//   if (typeof window == "undefined") return io(socketHost, { path });
//   if (!(window as any)._socket) {
//     (window as any)._socket = io(socketHost, { path });
//   }
//   return (window as any)._socket as Socket;
// });