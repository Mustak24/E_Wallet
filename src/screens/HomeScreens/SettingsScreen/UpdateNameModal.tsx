import { useState } from "react";
import BottomModal from "../../../components/Modal/BottomModal";
import { AppStorage } from "../../../Database/Storage";
import { useAppContext } from "../../../Contexts/AppContext";
import TextTheme from "../../../components/Text/TextTheme";
import { TextInput } from "react-native-gesture-handler";
import FeatherIcons from 'react-native-vector-icons/Feather';
import { useTheme } from "../../../Contexts/ThemeProvider";

type UpdateNameModalProps = {
    visible: boolean,
    setVisible: (vis: boolean) => void
}

export default function UpdateNameModal({visible, setVisible}: UpdateNameModalProps): React.JSX.Element {
    
    const {setUsername} = useAppContext();
    const {primaryColor: color} = useTheme();

    const [name, setName] = useState<string>(AppStorage.getString('username') ?? 'Undefined');

    function updateName() {
        if(!name) return;
        AppStorage.set('username', name);

        setUsername(name);
        setVisible(false);
        setName('');
    }

    return (
        <BottomModal
            visible={visible} 
            setVisible={setVisible}
            actionButtons={[
                {
                    title: 'Save',
                    backgroundColor: 'rgb(15,150,100)',
                    onPress: updateName,
                    icon: <FeatherIcons name="save" size={20} color={'white'} />
                }
            ]}
            style={{paddingInline: 20}}
        >
            <TextTheme style={{fontWeight: '900', fontSize: 14}}>Edit Name</TextTheme>
            <TextInput  
                value={name}
                onChangeText={setName}
                placeholder="Enter Name..."
                placeholderTextColor={color}
                style={{color, fontWeight: 900, fontSize: 28, opacity: name ? 1 : 0.5}}
                autoCapitalize="sentences"
                autoFocus={true}
            />
        </BottomModal>
    )
}