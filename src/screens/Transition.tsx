import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { View } from "react-native";
import AnimateButton from "../components/AnimateButton";
import FeatherIcons from 'react-native-vector-icons/Feather';
import { useEffect, useRef, useState } from "react";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { stackParamsList } from "../../App";
import HandleSwipe from "../components/HandleSwipe";
import RoundedView from "../components/RoundedView";
import BottomModal from "../components/BottomModal";
import Calculator from "../components/Calculator";
import TransitionModal from "../Database/Models/TransitionModal";
import AccountModal from "../Database/Models/AccountModal";


type transitionInfoType = {
    mode: transitionMode,
    backgroundColor: string,
    title: string,
    iconName: string
}

type transitionMode = 'income' | 'expenses' | 'transfer';

type TransitionProps = BottomTabScreenProps<stackParamsList, 'transition'>


const transitionInfo: transitionInfoType[] = [
    {
        mode: 'income',
        backgroundColor: 'rgb(25,200,150)',
        iconName: 'download',
        title: 'Add to money'
    },

    {
        mode: 'expenses',
        backgroundColor: 'gray',
        iconName: 'upload',
        title: 'Pay with'
    },

    {
        mode: 'transfer',
        backgroundColor: 'rgb(130,100,255)',
        iconName: 'shuffle',
        title: ''
    }
]



export default function Transition({route, navigation}: TransitionProps): React.JSX.Element {
   
    const {mode} = route.params;

    const [amount, setAmount] = useState<number>(0)
    const [transitionMode, setTransitionMode] = useState<transitionMode>(mode);
    const [accountId, setAccountId] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    
    
    const [paddingBottom, setPaddingBottom] = useState<number>(0) 
    const getTransitonInfo = () => transitionInfo[transitionMode == 'income' ? 0 : transitionMode == 'expenses' ? 1 : 2]

    const time = useRef<string>((() => {
        let date = new Date();
        let mode = Math.floor(date.getHours() / 12) ? 'AM' : 'PM';
        let time = `${date.getHours() % 12}:${date.getMinutes()}`
        return `${time} ${mode}`;
    })()).current;

    const date = useRef<string>((()=>{
        let date = new Date();
        let mounth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
        return `${mounth} ${date.getDate()}`;
    })()).current

    const accountsId = useRef<string[]>(AccountModal.getAllId()).current;


    function createTransiton() {
        if(!title || !accountId || !mode || !amount) {
            console.log("ERROR");
            return;
        }
        let transition = TransitionModal.create({title, description: '', accountId: accountId, mode, amount, date, time});
        console.log(transition);
    }
    
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.root, {paddingBottom}]}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.topNav}>
                    <AnimateButton style={styles.topNav_closeBtn} onPress={() => navigation.navigate('home')}>
                        <FeatherIcons name="plus" size={20} color={'white'} style={{transform: 'rotate(45deg)'}} />
                    </AnimateButton>

                    <View style={[styles.center, {flexDirection: 'row', gap: 6}]}>
                        {
                            transitionInfo.map(({backgroundColor, iconName, mode}) => (
                                <AnimateButton 
                                key={mode}
                                style={{
                                    ...styles.topNav_modeSelector, 
                                    backgroundColor: mode == transitionMode ?  backgroundColor : 'transparent'
                                }} 
                                onPress={() => setTransitionMode(mode)}
                                >
                                        <FeatherIcons
                                            color={'white'} 
                                            size={20}
                                            name={iconName} 
                                            />
                                    </AnimateButton>
                                )
                            )
                        }
                    </View>
                </View>

                <View style={{marginBlock: 20}}>
                    <TextInput 
                        value={title}
                        style={styles.titleInput} 
                        placeholder={`${transitionMode[0].toLocaleUpperCase() + transitionMode.slice(1)} title`} 
                        onFocus={() => setPaddingBottom(20)}
                        onBlur={() => setPaddingBottom(0)}
                        onChangeText={setTitle}
                    />
                </View>

                <View style={[styles.center, {gap: 10}]}>
                    <AnimateButton style={styles.box}>
                        <FeatherIcons name="align-left" size={20} color={'white'} />
                        <Text style={{color: 'white', fontWeight: '900'}}>Add description</Text>
                    </AnimateButton>

                    <AnimateButton style={{...styles.box, justifyContent: 'space-between'}}>
                        <View style={[styles.center, {gap: 14, flexDirection: 'row'}]}>
                            <FeatherIcons name="calendar" size={20} color={'white'} />
                            <Text style={{color: 'white', fontWeight: '900', opacity: 0.4}}>Created on</Text>
                        </View>
                        <Text style={{color: 'white', fontWeight: '900'}}>{time}</Text>
                    </AnimateButton>
                </View>
            </ScrollView>

            <View style={styles.bottomOpationContener}>
                <AmountBox 
                    heading={getTransitonInfo().title} 
                    accountsId={accountsId} 
                    amount={amount} 
                    setAmount={setAmount} 
                    onChangeAccount={setAccountId}
                />

                <View style={styles.bottomOpations}>
                    <AnimateButton style={styles.closeBtn}>
                        <FeatherIcons name="plus" size={16} color={'white'} style={{transform: 'rotate(45deg)'}} />
                    </AnimateButton>
                    
                    <View style={styles.actionsButtonsBox}>
                        <AnimateButton style={{...styles.actionBtn, backgroundColor: 'rgb(25,200,150)'}} onPress={createTransiton}>
                            <Text style={{color: 'white', fontWeight: '900'}}>Save</Text>
                        </AnimateButton>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}


type AmountBoxProps = {
    heading: string,
    accountsId: string[],
    amount: number,
    setAmount: (amount: number) => void
    onChangeAccount?: (acc: string) => void,
}

function AmountBox({heading, accountsId, onChangeAccount=()=>{}, amount, setAmount}: AmountBoxProps){

    const [useAcc, setUseAcc] = useState<string>(accountsId[0]);
    const [isOpenCal, setOpenCal] = useState<boolean>(true);

    useEffect(() => {
        onChangeAccount(useAcc);
    }, [useAcc])

    return (
        <HandleSwipe style={{display: 'flex', width: '100%', paddingInline: 20}} >
            <Text style={{color: 'white', fontSize: 16, fontWeight: '900', paddingLeft: 8}}>{heading}</Text>

            <ScrollView contentContainerStyle={{width: '100%', height: 50, gap: 20, marginBlock: 16}} horizontal={true}>   
                {
                    accountsId.map(id => {
                        let {name=''} = AccountModal.findById(id) || {};
                        return (
                            <Pressable key={name} onPress={() => setUseAcc(id)}>
                                <RoundedView  
                                    key={name} 
                                    title={name} 
                                    color="white" 
                                    backgroundColor={id == useAcc ? "rgb(20,200,150)" : 'transparent'}
                                    style={{borderWidth: 1, borderColor: 'gray'}} 
                                />
                            </Pressable>
                        )
                    })
                }
            </ScrollView>

            <Pressable style={[styles.center, {width: '100%', alignSelf: 'center', marginBottom: 20}]} onPress={() => setOpenCal(true)}>
                <Text style={{fontWeight: 900, fontSize: 28, color: 'white'}}>
                    <Text>{amount || '0.00'}</Text>
                    <Text> INR</Text>
                </Text>
            </Pressable>

            <BottomModal 
                visible={isOpenCal} 
                setVisible={setOpenCal}
                backgroundColor="rgba(0,0,0,.8)" 
                style={{backgroundColor: 'black', paddingInline: 20}}
                actionButtons={[
                    {
                        title: 'Set', 
                        backgroundColor: "rgb(25,200,150)",
                        onPress: () => setOpenCal(false), 
                    }
                ]}
            >
                <Text style={{color: 'white', fontSize: 16, fontWeight: '900', paddingLeft: 8}}>{heading}</Text>

                <ScrollView contentContainerStyle={{width: '100%', height: 50, gap: 20, marginBlock: 16}} horizontal={true}>   
                    {
                        accountsId.map(id => {
                            let {name=''} = AccountModal.findById(id) || {};
                            return (
                                <Pressable key={name} onPress={() => setUseAcc(id)}>
                                    <RoundedView  
                                        key={name} 
                                        title={name} 
                                        color="white" 
                                        backgroundColor={id == useAcc ? "rgb(20,200,150)" : 'transparent'}
                                        style={{borderWidth: 1, borderColor: 'gray'}} 
                                    />
                                </Pressable>
                            )
                        })
                    }
                </ScrollView>

                <Calculator onResult={setAmount} value={amount}/>
            </BottomModal>
        </HandleSwipe>
    )
}

const styles = StyleSheet.create({
    
    root:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'black',
        width: '100%',
        height: '100%',
    },
    
    scrollView: {
        display: 'flex',
        width: '100%',
        height: '100%',
        paddingBlock: 10,
        paddingInline: 20
    },

    center: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    topNav: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '100%',
        height: 50
    },

    topNav_closeBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        aspectRatio: 1,
        borderRadius: 1000,
        borderWidth: 1,
        borderColor: 'gray'
    },

    topNav_modeSelector: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 44,
        aspectRatio: 1,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 1000,
        gap: 4
    },

    titleInput: {
        width: '100%',
        height: 60,
        fontSize: 24,
        fontWeight: 900,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        color: "white"
    },

    box: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        paddingInline: 20,
        gap: 14,
        backgroundColor: "rgb(24,24,24)",
        borderRadius: 20,
        width: "100%",
        height: 60
    },

    bottomOpationContener: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginInline: 2,
        paddingTop: 20,
        borderWidth: 1,
        borderBottomWidth: 0,
        borderColor: 'gray',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },

    bottomOpations: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderColor: 'gray',
        borderWidth: 1,
        borderBottomWidth: 0,
        width: '100%',
        paddingInline: 20
    },

    closeBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        width: 36,
        aspectRatio: 1,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'gray',
        position: 'relative',
        top: -18
    },

    actionsButtonsBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 14,
        transform: 'translateY(-25%)',
        position: 'relative'
    },

    actionBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingInline: 20,
        height: 40,
        borderRadius: 100,
        borderColor: 'gray',
        borderWidth: 1
    }
})

