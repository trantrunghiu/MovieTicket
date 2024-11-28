import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import Tts from 'react-native-tts'; // Sử dụng react-native-tts thay cho expo-speech
import Icon from 'react-native-vector-icons/FontAwesome'; // Thay đổi từ expo-vector-icons sang react-native-vector-icons
import Entypo from 'react-native-vector-icons/Entypo'; // Cũng thay đổi từ expo-vector-icons sang react-native-vector-icons
import AsyncStorage from '@react-native-async-storage/async-storage'; // Sử dụng AsyncStorage
import * as GoogleGenerativeAI from '@google/generative-ai';
import {COLORS} from '../themes/theme';
import {useNavigation} from '@react-navigation/native'; // Thêm hook navigation
import CustomIcon from './CustomIcon';
import {UserContext} from '../context/UserContext';
import firestore from '@react-native-firebase/firestore';
const GeminiChat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showStopIcon, setShowStopIcon] = useState(true);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const API_KEY = 'AIzaSyB0tcgYTv_Fdod-cZWY-9cFhu7AXwMIWDM';
  const navigation = useNavigation(); // Dùng hook navigation để quay lại
  const userContext = useContext(UserContext); // Truy cập thông tin người dùng từ Context
  const user = userContext?.user;
  const [userData, setUserData] = useState(null);
  const flatListRef = useRef(null); // Tham chiếu đến FlatList
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const userRef = firestore().collection('users').doc(user.uid);
          const doc = await userRef.get();
          if (doc.exists) {
            setUserData(doc.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, [user]);
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem('chatHistory');
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        }
      } catch (error) {
        Alert.log('Error loading chat history:', error);
      }
    };
    loadChatHistory();
  }, []);

  const saveChatHistory = async newMessages => {
    try {
      await AsyncStorage.setItem('chatHistory', JSON.stringify(newMessages));
    } catch (error) {
      Alert.log('Error saving chat history:', error);
    }
  };

  const sendMessage = async () => {
    setLoading(true);

    // Thêm tin nhắn của người dùng vào danh sách tin nhắn
    const userMessage = {text: userInput, user: true};
    const updatedMessages = [...messages, userMessage];

    // Thêm tin nhắn "AI is typing..." để giả lập phản hồi từ AI
    const aiTypingMessage = {
      text: 'AI is typing...',
      user: false,
      isTyping: true,
    };
    updatedMessages.push(aiTypingMessage);

    // Cập nhật danh sách tin nhắn
    setMessages(updatedMessages);
    saveChatHistory(updatedMessages);
    // Cuộn xuống cuối màn hình
    flatListRef.current.scrollToEnd({animated: true});
    // Gọi API để lấy phản hồi từ AI
    const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({model: 'gemini-pro'});
    const prompt = userMessage.text;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Thay thế tin nhắn "AI is typing..." bằng kết quả thực tế từ AI
    const aiResponseMessage = {text, user: false, isTyping: false};

    // Cập nhật lại tin nhắn cuối cùng với kết quả từ AI
    const finalMessages = updatedMessages.map((msg, index) => {
      if (msg.isTyping && index === updatedMessages.length - 1) {
        return aiResponseMessage; // Thay thế "AI is typing..." bằng phản hồi thực tế
      }
      return msg; // Giữ nguyên các tin nhắn khác
    });

    // Cập nhật lại tin nhắn và lưu vào AsyncStorage
    setMessages(finalMessages);
    saveChatHistory(finalMessages);
    setLoading(false);
    setUserInput('');
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      Tts.stop();
      setIsSpeaking(false);
    } else {
      Tts.speak(messages[messages.length - 1].text);
      setIsSpeaking(true);
    }
  };

  const ClearMessage = () => {
    setMessages([]);
    setIsSpeaking(false);
    saveChatHistory([]); // Clear chat history in AsyncStorage
  };
  const renderMessage = ({item}) => {
    // Nếu là tin nhắn của AI và đang gõ, hiển thị dấu ba chấm
    const isAiMessageWithTyping = !item.user && item.isTyping;

    // Hiển thị 3 dấu chấm động
    const loadingText = 'AI is typing' + (isAiTyping ? '.' : '');

    return (
      <View
        style={[
          styles.messageContainer,
          item.user ? styles.userMessageContainer : styles.aiMessageContainer,
        ]}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              item.user && userData?.avatar
                ? {uri: userData.avatar}
                : require('../assets/image/avatar.png')
            }
            style={styles.avatar}
          />
        </View>
        <View style={styles.messageTextContainer}>
          <Text
            style={[
              styles.messageText,
              item.user ? styles.userMessageText : styles.aiMessageText,
            ]}>
            {isAiMessageWithTyping ? loadingText : item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Nút back */}
      <View style={styles.headerRow}>
        <Entypo name="chat" size={30} color="white" />
        <Text style={{color: 'white', fontSize: 20, marginLeft: 10}}>
          TrungHieu Chat
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <CustomIcon name={'arrow-left'} size={30} color="white" />
          <Text style={{color: 'white', fontSize: 15}}>Back</Text>
        </TouchableOpacity>
      </View>
      {/* Hiển thị các tin nhắn */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.micIcon} onPress={toggleSpeech}>
          {isSpeaking ? (
            <Icon name="microphone-slash" size={24} color="white" />
          ) : (
            <Icon name="microphone" size={24} color="white" />
          )}
        </TouchableOpacity>
        <TextInput
          placeholder="Type a message"
          onChangeText={setUserInput}
          value={userInput}
          onSubmitEditing={sendMessage}
          style={styles.input}
          placeholderTextColor="#fff"
        />
        {showStopIcon && (
          <TouchableOpacity style={styles.stopIcon} onPress={ClearMessage}>
            <Icon name="stop" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Black,
    padding: 10,
    justifyContent: 'flex-end',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    zIndex: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageContainer: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    maxWidth: '75%',
    borderRadius: 10,
    backgroundColor: COLORS.Orange,
  },
  avatarContainer: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  messageTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  aiMessageContainer: {
    backgroundColor: '#e1e1e1',
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  userMessageContainer: {
    backgroundColor: COLORS.Orange,
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: 'white',
  },
  aiMessageText: {
    color: '#131314',
  },
  userMessageText: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.Orange,
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    height: 50,
    color: 'white',
    marginLeft: 10,
    marginRight: 10,
  },
  micIcon: {
    padding: 12,
    backgroundColor: '#1e1e1e',
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopIcon: {
    padding: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.Orange,
    padding: 10,
    borderRadius: 10,
  },
});

export default GeminiChat;
