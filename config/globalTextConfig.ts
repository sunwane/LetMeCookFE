import { Text, TextInput } from 'react-native';

// Override Text component toàn cục để cố định font scaling
(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.allowFontScaling = false;

// Override TextInput component toàn cục
(TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
(TextInput as any).defaultProps.allowFontScaling = false;