import { Server } from 'socket.io';

<<<<<<< HEAD
<<<<<<< HEAD
export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Handle messages
    socket.on('message', (msg: { text: string; senderId: string }) => {
      // Echo: broadcast message only the client who send the message
      socket.emit('message', {
        text: `Echo: ${msg.text}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
=======
interface User {
  id: string;
  name: string;
  email: string;
  joinedAt: Date;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  type: 'user' | 'system' | 'ai';
}

interface Activity {
  id: string;
  type: 'user_joined' | 'user_left' | 'message_sent' | 'ai_query' | 'system_event';
  description: string;
  timestamp: Date;
  userId?: string;
  data?: any;
}

=======
>>>>>>> d42c0d685ce849bd67e1864a8ab26a7276eeec64
export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Handle messages
    socket.on('message', (msg: { text: string; senderId: string }) => {
      // Echo: broadcast message only the client who send the message
      socket.emit('message', {
        text: `Echo: ${msg.text}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

<<<<<<< HEAD
    // Handle AI response simulation (for demo purposes)
    socket.on('ai_response', (data: { queryId: string; response: string }) => {
      const message: Message = {
        id: Date.now().toString(),
        text: data.response,
        senderId: 'ai',
        senderName: 'AI Assistant',
        timestamp: new Date(),
        type: 'ai',
      };

      messages.push(message);
      io.emit('message', message);

      addActivity({
        type: 'ai_query',
        description: 'AI responded to query',
        data: { queryId: data.queryId, responseId: message.id },
      });
    });

    // Handle typing indicators
    socket.on('typing_start', () => {
      const user = connectedUsers.get(socket.id);
      if (user) {
        socket.broadcast.emit('user_typing', {
          userId: socket.id,
          userName: user.name,
          isTyping: true,
        });
      }
    });

    socket.on('typing_stop', () => {
      socket.broadcast.emit('user_typing', {
        userId: socket.id,
        isTyping: false,
      });
    });

    // Handle system notifications
    socket.on('system_notification', (notification: { title: string; message: string; type?: 'info' | 'success' | 'warning' | 'error' }) => {
      const user = connectedUsers.get(socket.id);
      if (!user) return;

      io.emit('notification', {
        id: Date.now().toString(),
        title: notification.title,
        message: notification.message,
        type: notification.type || 'info',
        timestamp: new Date(),
        senderName: user.name,
      });
    });

    // Handle real-time analytics
    socket.on('analytics_event', (event: { type: string; data: any }) => {
      const user = connectedUsers.get(socket.id);
      if (!user) return;

      // Broadcast analytics event to all connected clients
      io.emit('analytics_update', {
        type: event.type,
        data: event.data,
        timestamp: new Date(),
        userId: socket.id,
        userName: user.name,
      });
    });

    // Handle file sharing events
    socket.on('file_shared', (fileData: { name: string; size: number; type: string }) => {
      const user = connectedUsers.get(socket.id);
      if (!user) return;

      io.emit('file_shared', {
        id: Date.now().toString(),
        fileName: fileData.name,
        fileSize: fileData.size,
        fileType: fileData.type,
        sharedBy: user.name,
        sharedAt: new Date(),
      });

      addActivity({
        type: 'system_event',
        description: `${user.name} shared a file: ${fileData.name}`,
        userId: user.id,
        data: { fileName: fileData.name, fileSize: fileData.size },
      });
    });

    // Handle custom events
    socket.on('custom_event', (event: { type: string; data: any; broadcast?: boolean }) => {
      const user = connectedUsers.get(socket.id);
      if (!user) return;

      const enhancedEvent = {
        ...event,
        id: Date.now().toString(),
        timestamp: new Date(),
        userId: socket.id,
        userName: user.name,
      };

      if (event.broadcast) {
        io.emit('custom_event', enhancedEvent);
      } else {
        socket.emit('custom_event', enhancedEvent);
      }
>>>>>>> 810ae400916ac3a858f3738237e3376f277d0d25
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
<<<<<<< HEAD
    });

    // Send welcome message
    socket.emit('message', {
      text: 'Welcome to WebSocket Echo Server!',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
=======
      
      const user = connectedUsers.get(socket.id);
      if (user) {
        connectedUsers.delete(socket.id);
        
        // Broadcast to all clients
        io.emit('user_left', { userId: socket.id, userName: user.name });
        broadcastUserCount();
        broadcastActiveUsers();
        
        addActivity({
          type: 'user_left',
          description: `${user.name} left the platform`,
          userId: user.id,
        });
      }
=======
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
>>>>>>> d42c0d685ce849bd67e1864a8ab26a7276eeec64
    });

    // Send welcome message
    socket.emit('message', {
      text: 'Welcome to WebSocket Echo Server!',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
<<<<<<< HEAD

  // Global system events
  setInterval(() => {
    if (connectedUsers.size > 0) {
      addActivity({
        type: 'system_event',
        description: `System health check - ${connectedUsers.size} active users`,
      });
    }
  }, 300000); // Every 5 minutes
>>>>>>> 810ae400916ac3a858f3738237e3376f277d0d25
=======
>>>>>>> d42c0d685ce849bd67e1864a8ab26a7276eeec64
};