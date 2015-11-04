#include "Rosys.h"


volatile unsigned char *PORT[]={&PORTA,&PORTB,&PORTC,&PORTD,&PORTE,&PORTF,&PORTG};
volatile unsigned char *PIN[]={&PINA,&PINB,&PINC,&PIND,&PINE,&PINF,&PING};
volatile unsigned char *DDR[]={&DDRA,&DDRB,&DDRC,&DDRD,&DDRE,&DDRF,&DDRG};
volatile unsigned long g_Time_Ms=0;
volatile unsigned long ledst=0;
#ifdef __Motor_USE
#ifdef __ST_USE
unsigned char StepPort[2],StepHigh[2],StepMode[2],StepSta[2];
#endif
#endif
#ifdef __LDM_USE
unsigned char LinePort,RedPort,GreenPort;
#endif
#ifdef __KEY_USE
unsigned char KdmPort;
#endif
#ifdef  __USART_USE
volatile static unsigned char UART_RxBuf[UART_RX_BUFFER_SIZE];
volatile static unsigned char UART_RxHead;
volatile static unsigned char UART_RxTail;
volatile static unsigned char UART_TxBuf[UART_TX_BUFFER_SIZE];
volatile static unsigned char UART_TxHead;
volatile static unsigned char UART_TxTail;

volatile static unsigned char UART0_RxBuf[UART_RX_BUFFER_SIZE];
volatile static unsigned char UART0_RxHead;
volatile static unsigned char UART0_RxTail;
volatile static unsigned char UART0_TxBuf[UART_TX_BUFFER_SIZE];
volatile static unsigned char UART0_TxHead;
volatile static unsigned char UART0_TxTail;

///////////////////////////////////////
//�������ƣ�uart_init
//�������ͣ�void 
//�������ã���ʼ��Atmega128�еĴ���ͨѶģ��
//������
//unsigned char id��ͨѶģ��ID��Atmega128������������ͨѶģ��
//unsigned char bandindex��������ID����14.7456M�£����ڵĲ�������4800��9600��19200��38400��57600��115200
//unsigned char p��У�鷽ʽID����У�顢żУ�顢��У��
///////////////////////////////////////
void uart_init(unsigned char id,unsigned char bandindex,unsigned char p)
{
	unsigned char ledbr[]={191,95,47,23,15,7};
	unsigned char pp[]={0x30,0x20,0x00};
	if(id)
	{
		UCSR1B = 0x00; //disable while setting baud rate
		UCSR1A = 0x00;
		UCSR1C = 0x06 + pp[p];
		UBRR1L = ledbr[bandindex]; //set baud rate lo
		UBRR1H = 0x00; //set baud rate hi
		UCSR1B = 0x98;
	}
	else
	{
		UCSR0B = 0x00; //disable while setting baud rate
		UCSR0A = 0x00;
		UCSR0C = 0x06 + pp[p];
		UBRR0L = ledbr[bandindex]; //set baud rate lo
		UBRR0H = 0x00; //set baud rate hi
		UCSR0B = 0x98;
	}
}
///////////////////////////////////////
//�жϺ���
//�ж�Դ��SIG_UART1_RECV
//�ж����������п�1�����ж�
///////////////////////////////////////
//SIGNAL(SIG_UART1_RECV)
ISR(USART1_RX_vect)
{
	unsigned char data;
	unsigned char tmphead;
	data=UDR1;
	tmphead=(UART_RxHead+1)&UART_RX_BUFFER_MASK;
	UART_RxHead=tmphead;
	UART_RxBuf[tmphead]=data;
}
///////////////////////////////////////
//�жϺ���
//�ж�Դ��SIG_UART0_RECV
//�ж����������п�0�����ж�
///////////////////////////////////////
//SIGNAL(SIG_UART0_RECV)
ISR(USART0_RX_vect)
{
	unsigned char data;
	unsigned char tmphead;
	data=UDR0;
	tmphead=(UART0_RxHead+1)&UART_RX_BUFFER_MASK;
	UART0_RxHead=tmphead;
	UART0_RxBuf[tmphead]=data;
}
///////////////////////////////////////
//�жϺ���
//�ж�Դ��SIG_UART1_DATA
//�ж����������п�1���ݿ��жϣ����ڷ�������
///////////////////////////////////////
//SIGNAL(SIG_UART1_DATA)
ISR(USART1_TX_vect)
{
	unsigned char tmptail;
	if(UART_TxHead!=UART_TxTail)
	{
		tmptail=(UART_TxTail+1)&UART_TX_BUFFER_MASK;
		UART_TxTail=tmptail;
		UDR1=UART_TxBuf[tmptail];
	}
	else
	{
		UCSR1B&=~(1<<UDRIE1);
	}
}
///////////////////////////////////////
//�жϺ���
//�ж�Դ��SIG_UART0_DATA
//�ж����������п�0���ݿ��жϣ����ڷ�������
///////////////////////////////////////
//SIGNAL(SIG_UART0_DATA)
ISR(USART0_TX_vect)
{
	unsigned char tmptail;
	if(UART0_TxHead!=UART0_TxTail)
	{
		tmptail=(UART0_TxTail+1)&UART_TX_BUFFER_MASK;
		UART0_TxTail=tmptail;
		UDR0=UART0_TxBuf[tmptail];
	}
	else
	{
		UCSR0B&=~(1<<UDRIE0);
	}
}
///////////////////////////////////////
//�������ƣ�uGetChar
//�������ͣ�unsigned char 
//�������ã��Ӵ��пڽ��ջ���ȥ�н�������
//������
//unsigned char id������ID
///////////////////////////////////////
unsigned char uGetChar(unsigned char id)
{
	unsigned char tmptail;
	if(id)
	{
		if(UART_RxHead==UART_RxTail)return 0;
		 
		tmptail=(UART_RxTail+1)&UART_RX_BUFFER_MASK;
		UART_RxTail=tmptail;
		return UART_RxBuf[tmptail];
	}
	else
	{
		if(UART0_RxHead==UART0_RxTail)return 0;
		 
		tmptail=(UART0_RxTail+1)&UART_RX_BUFFER_MASK;
		UART0_RxTail=tmptail;
		return UART0_RxBuf[tmptail];
	}
}
///////////////////////////////////////
//�������ƣ�uPutChar
//�������ͣ�void 
//�������ã�������д�뻺�������ȴ����ڷ���
//������
//unsigned char id������ID
//unsigned char data��Ҫ���͵�����
///////////////////////////////////////
void uPutChar(unsigned char id,unsigned char data)
{
	unsigned char tmphead; 
	if(id)
	{
		tmphead=(UART_TxHead+1)&UART_TX_BUFFER_MASK;
		while(tmphead==UART_TxTail);
		UART_TxBuf[tmphead]=data;
		UART_TxHead=tmphead;
		UCSR1B|=(1<<UDRIE1);
	}
	else
	{
		tmphead=(UART0_TxHead+1)&UART_TX_BUFFER_MASK;
		while(tmphead==UART0_TxTail);
		UART0_TxBuf[tmphead]=data;
		UART0_TxHead=tmphead;
		UCSR0B|=(1<<UDRIE0);
	}
}
#endif
#ifdef __LDM_USE
///////////////////////////////////////
//�������ƣ�InitLDM
//�������ͣ�void
//�������ã���ʼ��LDMģ��
//������
//unsigned char Line��COM�˶˿�ѡ��
//unsigned char Red����ɫ����˶˿�ѡ��
//unsigned char Green����ɫ����˿�ѡ��
///////////////////////////////////////
void InitLDM(unsigned char Line,unsigned char Red,unsigned char Green)
{
	LinePort=Line;
	RedPort=Red;
	GreenPort=Green;
	*DDR[LinePort]=*DDR[RedPort]=*DDR[GreenPort]=0xff;
	*PORT[LinePort]=0x00;
	*PORT[RedPort]=*PORT[GreenPort]=0xff;
}
///////////////////////////////////////
//�������ƣ�LDM
//�������ͣ�void
//�������ã�����LDM
//������
//unsigned char Line���б��
//unsigned char Red����ɫ����
//unsigned char Green����ɫ����
///////////////////////////////////////
void LDM(unsigned char Line,unsigned char Red,unsigned char Green)
{
	union
	{
		unsigned char x;
		struct
		{
			char bit0:1;
			char bit1:1;
			char bit2:1;
			char bit3:1;
			char bit4:1;
			char bit5:1;
			char bit6:1;
			char bit7:1;
		}b;
	}a,b;
	a.x=Green;
	b.b.bit0=a.b.bit7;
	b.b.bit1=a.b.bit6;
	b.b.bit2=a.b.bit5;
	b.b.bit3=a.b.bit4;
	b.b.bit4=a.b.bit3;
	b.b.bit5=a.b.bit2;
	b.b.bit6=a.b.bit1;
	b.b.bit7=a.b.bit0;
	Green=b.x;
	*PORT[LinePort]=1<<(Line&7);
	*PORT[RedPort]=~Red;
	*PORT[GreenPort]=~Green;
	delay_ms(2);
}
#endif
#ifdef __INT_USE
///////////////////////////////////////
//�������ƣ�InitInt
//�������ͣ�void 
//�������ã���ʼ���ⲿ�ж�
//������
//unsigned char index���ⲿ�ж�Դ���
//unsigned char enabled��1ʹ�ܣ�0��ֹ
//unsigned char mode��ģʽ�����������½���
///////////////////////////////////////
void InitInt(unsigned char index,unsigned char enabled,unsigned char mode)
{
//EICRB EICRA���жϿ��ƼĴ�����ÿ��λ����һ���жϣ����ַ�ʽ�ǣ��͵�ƽ���������½��ء�������
	unsigned int eicr=(((int)(EICRB))<<8)|EICRA;
	eicr&=~(3<<(index<<1));
	eicr|=mode<<(index<<1);
	EICRA=eicr;
	EICRB=eicr>>8;
//EIMSK���ж����μĴ���
	if(enabled)
		EIMSK|=BIT(index);
	else
		EIMSK&=~BIT(index);
}
#endif
#ifdef __KEY_USE
///////////////////////////////////////
//�������ƣ�initKdm
//�������ͣ�void 
//�������ã���ʼ����������
//������
//unsigned char kdm�������������IO�ڱ��
///////////////////////////////////////
void initKdm(unsigned char kdm)
{
	KdmPort=kdm;
	*DDR[kdm]=0x0f;
	*PORT[kdm]=0xf0;
}
///////////////////////////////////////
//�������ƣ�KeyScan
//�������ͣ�int 
//�������ã�ɨ����̡����ؼ�ֵ0��0xf������ް�������-1
//������
///////////////////////////////////////
int KeyScan()
{
	unsigned char i;
	unsigned char c;
	*DDR[KdmPort]=0xf0;
	*PORT[KdmPort]=0x0f;
	asm(""NOP"");
	asm(""NOP"");
	asm(""NOP"");
	asm(""NOP"");
	c=*PIN[KdmPort]&0x0f;
	if(c==0x0f)return 16;
	for(i = 4; i < 8; i++)
	{
		*PORT[KdmPort]=~(1<<i);
		delay_ms(2);
		c = ((*PIN[KdmPort])^ 0x0f) & 0x0f;
		if(c)
		{
			if(c & 1)
				c = 0;
			else if(c & 2)
				c = 1;
			else if(c & 4)
				c = 2;
			else if(c & 8)
				c = 3;
			return i+c*4-4;
		}
	}
	return 16;
}
#endif
#ifdef __Motor_USE
#ifdef __ST_USE
///////////////////////////////////////
//�������ƣ�initStep
//�������ͣ�void 
//�������ã���ʼ���������
//������
//unsigned char step��bit7��������
//                    bit6��ģʽ 0��˫���ķ�ʽ��1�����ķ�ʽ
//                    bit5~3���������˿ڱ��
//                    bit2���������˿ڸߵ�λ
///////////////////////////////////////
void initStep(unsigned char step)
{
	unsigned char Index=0;
	if(step&0x80)Index=1;
	StepMode[Index]=step&0x40?4:8;
	StepPort[Index]=(step>>3)&7;
	StepHigh[Index]=step&0x4?1:0;
	StepSta[Index]=0;
}

#endif
#ifdef __RC_USE
///////////////////////////////////////
//�������ƣ�Servo
//�������ͣ�void 
//�������ã��ı��ŷ�����˶�״̬
//������
//unsigned char Index��������
//int Degree������Ƕ�
///////////////////////////////////////
void Servo(unsigned char Index,int Degree)
{
	unsigned int ocr;
	if(Degree>90)Degree=90;
	if(Degree<-90)Degree=-90;
	ocr=RC_ZERO+Degree*RC_DEGREE;
	if(Index==0)
	{
		OCR1A=ocr;
	}
	else if(Index==1)
	{
		OCR1B=ocr;
	}
#ifdef __TWI_USE
	else if(Index<8)
	{
		unsigned char i = 0;
		int us = 10;
		for(i=0;i<6;i++)
		{
			i2c_maste_transt(0x10, 170);
			delay_ms(1);
		}
		i2c_maste_transt(0x10, Index-2);
		delay_ms(1);
		us = us * Degree;
		us = us + 1500;
		i = us % 256;
		i2c_maste_transt(0x10, i);
		delay_ms(1);
		i = us / 256;
		i2c_maste_transt(0x10, i);
		delay_ms(1);
		i2c_maste_transt(0x10, 187);
	}
	else
	{
		unsigned char i = 0;
		int us = 10;
		for(i=0;i<6;i++)
		{
			i2c_maste_transt(0x20, 170);
			delay_ms(1);
		}
		i2c_maste_transt(0x20, Index-8);
		delay_ms(1);
		us = us * Degree;
		us = us + 1500;
		i = us % 256;
		i2c_maste_transt(0x20, i);
		delay_ms(1);
		i = us / 256;
		i2c_maste_transt(0x20, i);
		delay_ms(1);
		i2c_maste_transt(0x20, 187);
	}
#endif
}
///////////////////////////////////////
//�������ƣ�InitServo
//�������ͣ�void 
//�������ã���ʼ���ŷ����
///////////////////////////////////////
void InitServo()
{
	DDRB=0XFF;
	PORTB=0XFF;
	TCCR1A=0xF0;
	TCCR1B=0x12;
	ICR1H=(unsigned char)(RC_CIRCLE>>8);
	ICR1L=(unsigned char)(RC_CIRCLE&0xff);
	OCR1AH=(unsigned char)(RC_ZERO>>8);
	OCR1AL=(unsigned char)(RC_ZERO&0xff);
	OCR1BH=(unsigned char)(RC_ZERO>>8);
	OCR1BL=(unsigned char)(RC_ZERO&0xff);
	Servo(0,0);
	Servo(1,0);
	return;
}
#endif
#ifdef __DC_USE
///////////////////////////////////////
//�������ƣ�InitMotor
//�������ͣ�void 
//�������ã���ʼ��ֱ�������ʹ��8Ϊ��ʱ������
///////////////////////////////////////
void InitMotor()
{
	TCCR0=0X79;
	TCCR2=0X79;
	TCNT0=TCNT2=0X00;
	OCR0=OCR2=0X00;
	DDRB=0XFF;
	PORTB=0XFF;
}
///////////////////////////////////////
//�������ƣ�_motor
//�������ͣ�void 
//�������ã��ı���������������˶�״̬
//������
//int left����һ������ķ������ٶȣ�����ֵ��ʾ�ٶȣ����ű�ʾ����
//int right���ڶ�������ķ������ٶ�
///////////////////////////////////////
void _motor(int left,int right)
{
	int LeftSpeed,RightSpeed;
	unsigned char l,r;
	if(left>0&&left<0X100)
		l=LEFT_FORWORD;
	else if(left<0&&-left<0X100)
		l=LEFT_BACK;
	else
		l=0XFF;
	if(right>0&&right<0X100)
		r=RIGHT_FORWORD;
	else if(right<0&&-right<0X100)
		r=RIGHT_BACK;
	else
		r=0XFF;
	PORTB=l&r;
	LeftSpeed=left>0?left:-left;
	RightSpeed=right>0?right:-right;
	if(LeftSpeed>255)LeftSpeed=255;
	if(RightSpeed>255)RightSpeed=255;
	OCR0=LeftSpeed;
	OCR2=RightSpeed;
}
///////////////////////////////////////
//�������ƣ�DCMotor
//�������ͣ�void 
//�������ã�����ֱ�����
//������
//int index��������
//int speed������ٶ��뷽��
///////////////////////////////////////
void DCMotor(int index,int speed)
{
	static int s[2]={0};
	if(speed>255)speed=255;
	if(speed<-255)speed=-255;
	if (index<2)
	{
		s[index]=speed;
		_motor(s[0],s[1]);
	}
#ifdef __TWI_USE
	else if(index<8)
	{
		unsigned char i = 0;
		int us = 10;
		for(i=0;i<6;i++)
		{
			i2c_maste_transt(0x30, 170);
			delay_ms(1);
		}
		i2c_maste_transt(0x30, index-2);
		delay_ms(1);
		i=speed>0?speed:-speed;
		i2c_maste_transt(0x30, i);
		delay_ms(1);
		i=speed>0?1:0;
		i2c_maste_transt(0x30, i);
		delay_ms(1);
		i2c_maste_transt(0x30, 187);
	}
	else
	{
		unsigned char i = 0;
		int us = 10;
		for(i=0;i<6;i++)
		{
			i2c_maste_transt(0x20, 170);
			delay_ms(1);
		}
		i2c_maste_transt(0x20, index-8);
		delay_ms(1);
		us = us * speed;
		us = us + 1500;
		i = us % 256;
		i2c_maste_transt(0x20, i);
		delay_ms(1);
		i = us / 256;
		i2c_maste_transt(0x20, i);
		delay_ms(1);
		i2c_maste_transt(0x20, 187);
	}
#endif
}
#endif
#endif
#ifdef __NUM_USE

volatile unsigned char NumPort;
volatile unsigned int LedNum=0;

//unsigned char Led_Disbuf[10]={0x3F,0x06,0x5B,0x4F,0x66,0x6D,0x7D,0x07,0x7F,0x6F}; //������
unsigned char Led_Disbuf[]={	//��������ܵı���
	0xC0,/*0*/
	0xF9,/*1*/
	0xA4,/*2*/
	0xB0,/*3*/
	0x99,/*4*/
	0x92,/*5*/
	0x82,/*6*/
	0xF8,/*7*/
	0x80,/*8*/
	0x90, /*9*/
};//������
unsigned char ComBuf[] ={		//�����λѡ���룬������ʾ8λ�еĵڼ�λ
	0x01,
	0x02,
	0x04,
	0x08,
	0x10,
	0x20,
	0x40,
	0x80,
	0xFF,/*ALL ON*/
	0x00 /*OFF*/
};
//595�˿ڳ�ʼ��
//void HC595_port_init(void)
//{
//PORTG = 0x00;
//DDRG |= (1 << PG0) | (1 << PG1) | (1 << PG2) | (1 << PG4);
//}
//����һ���ֽ�
void HC595_Send_Data(unsigned char byte)
{
	
	unsigned char i;
	(*PORT[NumPort] &= ~(1<<2));
	for(i = 0;i < 8;i++)
	{
		if(byte & 0x80)
		{
			(*PORT[NumPort] |= (1<<0));
		}
		else
		{
			(*PORT[NumPort] &= ~(1<<0));
		}
		(*PORT[NumPort] &= ~(1<<2));
		(*PORT[NumPort] |= (1<<2)); //������������λ
		(*PORT[NumPort] &= ~(1<<2));
		byte <<=1;
		
	}
}
//�����ַ���
void HC595_Output_Data(unsigned char data,unsigned char Location)
{
	unsigned char OutByte;
	(*PORT[NumPort] &= ~(1<<2));
	(*PORT[NumPort] &= ~(1<<1)); //�½������������ݲ���
	OutByte=ComBuf[Location-1];
	HC595_Send_Data(OutByte);
	
	OutByte=Led_Disbuf[data];
	HC595_Send_Data(OutByte);
	
	(*PORT[NumPort] &= ~(1<<1)); //�½������������ݲ���
	(*PORT[NumPort] |= (1<<1)); //���������ݴ���8λ������
	(*PORT[NumPort] &= ~(1<<1));
}


void InitNumLed(unsigned char Port)
{
	NumPort=Port;
	*DDR[Port]=0xff;
	*PORT[Port]=0x00;
}
void InitDelay()
{
	
	
}
///////////////////////////////////////
//�������ƣ�ToLed
//�������ͣ�void
//�������ã�LED�������ʾ��D�ڸ���λ�ṩλѡ������λG���ṩBin����
//������
//unsigned int l����ʾ�����֡�
///////////////////////////////////////
void ToLed(unsigned int l)
{
	LedNum=l;
	ledst=1;
}

#endif

void initTimer3()
{
	TCNT3=0x0000;
	TCCR3B=0x01;
	OCR3A=14745;
	ETIMSK=0x10;
}

SIGNAL(TIMER3_COMPA_vect)
{
	#ifdef __NUM_USE
	static unsigned char ledind=0;
	unsigned char a[4];
	*DDR[NumPort] = 0xFF;
	
	if(ledst==1)
	{
		
		a[0]=LedNum%10;    //��λ
		a[1]=(LedNum/10)%10;  //ʮλ
		a[2]=(LedNum/100)%10;  //��λ
		a[3]=(LedNum/1000)%10;  //ǧλ
		switch(ledind)
		{
			case 0: HC595_Output_Data(a[0],4); break;
			case 1: HC595_Output_Data(a[1],3); break;
			case 2: HC595_Output_Data(a[2],2); break;
			case 3: HC595_Output_Data(a[3],1); break;
			default: break;
		}
		
		if(LedNum>999)
		ledind=(ledind+1)%4;
		else if(LedNum>99)
		ledind=(ledind+1)%3;
		else if(LedNum>9)
		ledind=(ledind+1)%2;
		else
		ledind=0;
	}
	#endif
	g_Time_Ms++;
	TCNT3=0x0000;
}
unsigned long get_Time()
{

	return g_Time_Ms;
}
///////////////////////////////////////
//�������ƣ�delay_ms
//�������ͣ�void
//�������ã���ʱָ������
//������
//unsigned int a��������
///////////////////////////////////////
void delay_ms(unsigned long a)
{
	unsigned long b=get_Time();

	while(get_Time()<a+b)
	{
	}
}
///////////////////////////////////////
//�������ƣ�IoOut
//�������ͣ�void 
//�������ã�io�����ֽ����
//������
//unsigned char port���˿ڱ��
//unsigned char value��Ҫ�����ֵ
///////////////////////////////////////
void IoOut(unsigned char port,unsigned char value)
{
	*DDR[port]=0xff;
	*PORT[port]=value;
}
///////////////////////////////////////
//�������ƣ�IoIn
//�������ͣ�unsigned char 
//�������ã�io�����ֽ����룬���������ֵ
//������
//unsigned char port���˿ڱ��
///////////////////////////////////////
unsigned char IoIn(unsigned char port)
{
	*DDR[port]=0x00;
	return *PIN[port];
}
///////////////////////////////////////
//�������ƣ�read_adc
//�������ͣ�unsigned int 
//�������ã�ADת��������10λAD���
//������
//unsigned char adc_input��AD�ӿڱ��
///////////////////////////////////////
unsigned int read_adc(unsigned char adc_input)
{
	// Set ADC input
	ADMUX = 0x40;
	ADCSRA = 0x87;
	ADMUX &= 0xE0;
	ADMUX |= adc_input;
	// Start ADC conversion
	ADCSRA |= 1 << ADSC;
	// Waiting for ADC conversion completed
	loop_until_bit_is_set(ADCSRA, ADIF);
	ADCSRA |= 1<< ADIF;

	return ADC;
}


///////////////////////////////////////
//�������ƣ�IoOutB
//�������ͣ�void 
//�������ã���λ���
//������
//unsigned char address���˿ڱ��
//int bit��λ���
//unsigned char val��ֵ����������ߵ�ƽ��������͵�ƽ��
///////////////////////////////////////
void IoOutB(unsigned char address,int bit,unsigned char val)
{
	unsigned char byte=1<<bit;
	*DDR[address]|=byte;
	if(val)
		*PORT[address]|=byte;
	else
		*PORT[address]&=~byte;
}
///////////////////////////////////////
//�������ƣ�IoInB
//�������ͣ�unsigned char 
//�������ã���λ��ȡIO�ڵ�ƽ�����ط���ߵ�ƽ����͵�ƽ
//������
//unsigned char address���˿ڱ��
//int bit��λ���
///////////////////////////////////////
unsigned char IoInB(unsigned char address,int bit)
{
	unsigned char byte=1<<bit;
	*DDR[address]&=~byte;
	return *PIN[address]&byte?1:0;
}
unsigned char RemoteReceive(unsigned char address)
{
	*DDR[address] &= ~0x1f;
	*PORT[address] |= 0x1f;
	if (! (*PIN[address] & 0x10))
		return 16;
	return *PIN[address] & 0x0f;
}

#ifdef __TWI_USE
///////////////////////////////////////
//�������ƣ�twi_master_init
//�������ͣ�void 
//�������ã�������ʽ��ʼ��TWIģ��
//������
//unsigned char band�������ʼĴ�����ֵ
//unsigned char twps��Ԥ��Ƶ����ֵ
///////////////////////////////////////
void twi_master_init(unsigned char band,unsigned char twps){
 TWCR= 0x00; //disable twi
 TWBR= band; //set bit rate
 TWSR= 0x00+twps; //set prescale
 TWAR= 0x00; //set slave address
 TWCR= 0x04; //enable twi
}
//�������𶯿�ʼ����
void i2c_start(void){
	TWCR= (1<<TWINT)|(1<<TWSTA)|(1<<TWEN);
   	while (!(TWCR & (1<<TWINT))); //�ȴ�START �źųɹ�����
}
//��һ���ֽ�������������, ����TWI״̬
//���͵�ַ,r_w��1Ϊ����0Ϊд
unsigned char i2c_write_addr(unsigned char addr,unsigned char r_w)
{
 	if(r_w)
		TWDR = addr|r_w;     //RW Ϊ1��������
	else
		TWDR = addr & 0xFE;   // RW Ϊ0: д����
   	TWCR = (1<<TWINT)|(1<<TWEN); 
   	while (!(TWCR & (1<<TWINT)));
   	return(TWSR&0b11111000); //TWSR����λΪI2C����״̬��
}
//��һ���ֽ�������������, ����TWI״̬
//��������
unsigned char i2c_write_data(unsigned char data){
	TWDR = data;
   	TWCR = (1<<TWINT)|(1<<TWEN); 
   	while (!(TWCR & (1<<TWINT)));
   	return(TWSR&0b11111000); //TWSR����λΪI2C����״̬��
}
//����������һ���ֽ�
unsigned char i2c_read(void){
   	TWCR = (1<<TWINT)|(1<<TWEN); 
	Twi_NoAcK();
	while (!(TWCR & (1<<TWINT)));
   	return(TWDR);
}
//��������ֹͣ���� 
void i2c_stop(void) { 
   TWCR = (1<<TWINT)|(1<<TWSTO)|(1<<TWEN); 
}
///////////////////////////////////////
//�������ƣ�i2c_maste_transt
//�������ͣ�void 
//�������ã�������������
//�������裺 ���������͵�ַ���������ݣ��ر�����
//������
//unsigned char addr���ӻ���ַ
// unsigned char data�������͵�����
///////////////////////////////////////
void i2c_maste_transt(unsigned char addr, unsigned char data){
	i2c_start();
 
	if(i2c_write_addr(addr, 0)==TW_MT_SLA_ACK) //���͵�ַ�ɹ����յ�ACK
	{
		i2c_write_data(data);
		PORTD=PORTG=0x3f;
	}
	i2c_stop();
}
///////////////////////////////////////
//�������ƣ�i2c_maste_read
//�������ͣ�unsigned char 
//�������ã�����������ȡ�ӻ��е�����
//�������裬���������͵�ַ�������ݣ��ر�����
//������
//unsigned char addr���ӻ���ַ
///////////////////////////////////////
unsigned char i2c_maste_read(unsigned char addr){
	unsigned char tmp=0; 
	i2c_start();
	if(i2c_write_addr(addr, 1)==TW_MR_SLA_ACK) //���͵�ַ�ɹ����յ�ACK
	{
		tmp=i2c_read();
	}
	i2c_stop();
	return tmp;
}

///////////////////////////////////////
//�������ƣ�i2c_Ultr_Rag
//�������ͣ�unsigned char 
//�������ã�������ȡ�ӻ��еĳ�������ഫ����������
//������
//unsigned char addr���ӻ���ַ
///////////////////////////////////////
unsigned int i2c_Ultr_Rag(unsigned char addr){
	unsigned char miclow;
	unsigned char michi;
	unsigned int UltrRag;
	i2c_maste_transt(addr, 170);
	miclow = i2c_maste_read(addr);
    miclow=miclow&255;
	michi = i2c_maste_read(addr);
    michi=michi&255;
    UltrRag=michi*256+miclow;
	return UltrRag;
}
void i2c_Motor(unsigned char address,unsigned int MoterID,unsigned int speed, unsigned char dir){
		i2c_maste_transt(address, 0xaa);
		delay_ms(1);
		i2c_maste_transt(address, MoterID%2);
		delay_ms(1);
		i2c_maste_transt(address, speed & 0xff);
		delay_ms(1);
		i2c_maste_transt(address, dir);
		delay_ms(1);
		i2c_maste_transt(address,  0xbb);
		delay_ms(1);


}
///////////////////////////////////////
//�������ƣ�goStep
//�������ͣ�void 
//�������ã������������
//������
//unsigned char Index��������
//unsigned char dir�����ת������
///////////////////////////////////////
void goStep(unsigned char address,unsigned int total,unsigned int speed, unsigned char mode, unsigned char dir)
{
	unsigned char i = 0;

	for(i=0;i<6;i++)
	{
		i2c_maste_transt(address, 170);
		delay_ms(1);
	}

	i2c_maste_transt(address, 0xaa);
	delay_ms(1);
	i2c_maste_transt(address, 0x02);
	delay_ms(1);
	i2c_maste_transt(address, total & 0xff);
	delay_ms(1);
	i2c_maste_transt(address, (total >> 8) & 0xff);
	delay_ms(1);
	i2c_maste_transt(address, 0xbb);
	delay_ms(1);

	i2c_maste_transt(address, 0xaa);
	delay_ms(1);
	i2c_maste_transt(address, 0x03);
	delay_ms(1);
	i2c_maste_transt(address, mode);
	delay_ms(1);
	i2c_maste_transt(address, dir);
	delay_ms(1);
	i2c_maste_transt(address, 0xbb);
	delay_ms(1);
	
	i2c_maste_transt(address, 0xaa);
	delay_ms(1);
	i2c_maste_transt(address, 0x04);
	delay_ms(1);
	i2c_maste_transt(address, speed & 0xff);
	delay_ms(1);
	i2c_maste_transt(address, (speed >> 8) & 0xff);
	delay_ms(1);
	i2c_maste_transt(address, 0xbb);
	delay_ms(1);
	
	i2c_maste_transt(address, 0xaa);
	delay_ms(1);
	i2c_maste_transt(address, 0x05);
	delay_ms(1);
	i2c_maste_transt(address, 0);
	delay_ms(1);
	i2c_maste_transt(address, 0);
	delay_ms(1);
	i2c_maste_transt(address, 0xbb);
	delay_ms(1);
}
void i2c_Servo(unsigned char address, unsigned char index, int degree)
{
	int us;
	us = 1500 + 10 * degree;
	i2c_maste_transt(address, 0xaa);
	delay_ms(1);
	i2c_maste_transt(address, index);
	delay_ms(1);
	i2c_maste_transt(address, us % 256);
	delay_ms(1);
	i2c_maste_transt(address, us / 256);
	delay_ms(1);
	i2c_maste_transt(address, 0xbb);
	delay_ms(1);
}
#endif
