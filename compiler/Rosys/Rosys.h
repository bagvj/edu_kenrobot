#ifndef _ROSYS_H_
#define _ROSYS_H_

#define __NUM_USE
#define __USART_USE
#define F_CPU 14745600UL

#include "avr/io.h"
#include "avr/interrupt.h"
#include "util/delay.h"

enum P{A =0,B,C,D,E,F,G};

//typedef unsigned char ol;
//const bool true=1;
//connst bool false=0;
void setup();
void loop();
void initTimer3();
void InitNumLed(unsigned char Port);void ToLed(unsigned int l);
void HC595_Send_Data(unsigned char byte);
void HC595_Output_Data(unsigned char data,unsigned char Location);
void delay_ms(unsigned long a);
void DCMotor(int index,int speed);
void InitMotor();
void InitServo();
void initKdm(unsigned char kdm);
int  KeyScan();
void Servo(unsigned char Index,int Degree);
void initStep(unsigned char step);
void goStep(unsigned char Index,unsigned int total,unsigned int speed, unsigned char mode, unsigned char );
void i2c_Motor(unsigned char Index,unsigned int mode,unsigned int speed, unsigned char dir);
void IoOutB(unsigned char address,int bit,unsigned char val);
unsigned char IoInB(unsigned char address,int bit);
void IoOut(unsigned char port,unsigned char value);
unsigned char IoIn(unsigned char port);
unsigned int read_adc(unsigned char adc_input);
unsigned int i2c_Ultr_Rag(unsigned char addr);
unsigned char uGetChar(unsigned char id);
void uPutChar(unsigned char id,unsigned char data);
void InitInt(unsigned char index,unsigned char enabled,unsigned char mode);
void InitLDM(unsigned char Line,unsigned char Red,unsigned char Green);
void LDM(unsigned char Line,unsigned char Red,unsigned char Green);
unsigned char RemoteReceive(unsigned char address);
unsigned int i2c_Ultr_Rag(unsigned char addr);
//------------------------------------------------------------------------
//���͸�ָ���ӻ�һ������
//addrΪ�ӻ���ַ��data����
void i2c_maste_transt(unsigned char addr, unsigned char data);
//�Ӵӻ���ַ��ȡһ�����������ַ�������������
unsigned char i2c_maste_read(unsigned char addr);
//��ʼ��Ϊ����
void twi_master_init(unsigned char band,unsigned char twps);

#define SYSTEM_CLOCK 14745600L
#define RC_CIRCLE  (20L*SYSTEM_CLOCK/1000L/8/2)
#define RC_DEGREE  (SYSTEM_CLOCK/100000L/8/2)
#define RC_ZERO    (15L*SYSTEM_CLOCK/10000L/8/2)

#define BIT(i) 1<<I
#define sbi(a,b) a|=BIT(b)

#define RIGHT_FORWORD 0X77
#define RIGHT_BACK 0X7D  //0x3D
#define LEFT_FORWORD 0XEE
#define LEFT_BACK 0XEB

#define UART_RX_BUFFER_SIZE 128
#define UART_RX_BUFFER_MASK (UART_RX_BUFFER_SIZE-1)
#if (UART_RX_BUFFER_SIZE & UART_RX_BUFFER_MASK)
#error RX buffer size is not a power of 2
#endif

#define UART_TX_BUFFER_SIZE 128
#define UART_TX_BUFFER_MASK (UART_TX_BUFFER_SIZE-1)
#if (UART_TX_BUFFER_SIZE & UART_TX_BUFFER_MASK)
#error TX buffer size is not a power of 2
#endif

#define i2c_Compass i2c_Ultr_Rag
#define TWIBAND                 0x64    //������
//��������״̬��
#define TW_START				0x08	//START�ѷ���
#define TW_REP_START			0x10	//�ظ�START�ѷ���
#define TW_MT_SLA_ACK			0x18	//SLA+W �ѷ����յ�ACK
#define TW_MT_SLA_NACK			0x20	//SLA+W �ѷ��ͽ��յ�NOT ACK
#define TW_MT_DATA_ACK			0x28	//�����ѷ��ͽ��յ�ACK
#define TW_MT_DATA_NACK			0x30	//�����ѷ��ͽ��յ�NOT ACK
#define TW_MT_ARB_LOST			0x38	//SLA+W �����ݵ��ٲ�ʧ��
 
//��������״̬��
//#define TW_START				0x08	//START�ѷ���
//#define TW_REP_START			0x10	//�ظ�START�ѷ���
#define TW_MR_ARB_LOST			0x38	//SLA+R ��NOT ACK ���ٲ�ʧ��
#define TW_MR_SLA_ACK			0x40	//SLA+R �ѷ��ͽ��յ�ACK
#define TW_MR_SLA_NACK			0x48	//SLA+R �ѷ��ͽ��յ�NOT ACK
#define TW_MR_DATA_ACK			0x50	//���յ�����ACK �ѷ���
#define TW_MR_DATA_NACK			0x58	//���յ�����NOT ACK�ѷ���
 
//�ӻ�����״̬��
#define TW_SR_SLA_ACK			0x60	//�Լ���SLA+W �Ѿ�������ACK�ѷ���
#define TW_SR_ARB_LOST_SLA_ACK	0x68	//SLA+R/W ��Ϊ�������ٲ�ʧ�ܣ��Լ���SLA+W �Ѿ�������ACK �ѷ���
#define TW_SR_GCALL_ACK			0x70	//���յ��㲥��ַACK �ѷ���
#define TW_SR_ARB_LOST_GCALL_ACK 0x78	//SLA+R/W ��Ϊ�������ٲ�ʧ�ܣ����յ��㲥��ַACK�ѷ���
#define TW_SR_DATA_ACK			0x80	//��ǰ���Լ���SLA+W��Ѱַ�������Ѿ�������ACK�ѷ���
#define TW_SR_DATA_NACK			0x88	//��ǰ���Լ���SLA+W��Ѱַ�������Ѿ�������NOT ACK�ѷ���
#define TW_SR_GCALL_DATA_ACK	0x90	//��ǰ�Թ㲥��ʽ��Ѱַ�������Ѿ�������ACK�ѷ���
#define TW_SR_GCALL_DATA_NACK	0x98	//��ǰ�Թ㲥��ʽ��Ѱַ�������Ѿ�������NOT ACK�ѷ���
#define TW_SR_STOP				0xA0	//���Դӻ�����ʱ���յ�STOP���ظ�START
 
 
//�ӷ���״̬��
#define TW_ST_SLA_ACK			0xA8	//�Լ���SLA+R �Ѿ�������ACK �ѷ���
#define TW_ST_ARB_LOST_SLA_ACK	0xB0	//SLA+R/W ��Ϊ�������ٲ�ʧ�ܣ��Լ���SLA+R �Ѿ�������ACK �ѷ���
#define TW_ST_DATA_ACK			0xB8	//TWDR �������Ѿ����ͽ��յ�ACK
#define TW_ST_DATA_NACK			0xC0	//TWDR �������Ѿ����ͽ��յ�NOT ACK
#define TW_ST_LAST_DATA			0xC8	//TWDR ��һ�ֽ������Ѿ�����(TWAE = ��0��);���յ�ACK
 
 
//����״̬��
#define TW_NO_INFO				0xF8	//û����ص�״̬��Ϣ��TWINT = ��0��
#define TW_BUS_ERROR			0x00	//���ڷǷ���START ��STOP ��������ߴ���


// defines and constants 
#define TWCR_CMD_MASK     0x0F 
#define TWSR_STATUS_MASK  0xF8 

/***********************************************/
//����TWI����(��ģʽд�ʹ�ģʽ��)
/***********************************************/
//TWSR--Twi_״̬�Ĵ���,���TWI״̬,Ӧ�ý�Ԥ��Ƶλ����(����λ�Ǳ���λ)
#define Test_Twsr() 	  (TWSR&0xf8)
//��ѯģʽ�µȴ��жϷ���
#define Twi_WaitForComplete()          {while(!(TWCR&(1<<TWINT)));}
//����жϱ�־λ,ʹ��TWI����,����TWI�ж�,�����ؽ���״̬�¶�SDA����Ӧ��
#define Twi_Ack()	  {TWCR=(TWCR&TWCR_CMD_MASK)|(1<<TWEA)|(1<<TWINT);}
//����жϱ�־λ,ʹ��TWI����,����TWI�ж�,�����ؽ���״̬�²���SDA����Ӧ��
#define Twi_NoAcK()	  {TWCR=(TWCR&TWCR_CMD_MASK)|(1<<TWINT);}
//д��8λ���ݵ����ݼĴ�����,ͬʱ����жϱ�־λ��ʹ��TWI����
#define Twi_SendByte(x)		{TWDR=(x);TWCR=(TWCR&TWCR_CMD_MASK)|(1<<TWINT);}
//����жϱ�־λ���������Ϸ�����ֹ�źţ�����TWI���ܣ�
#define Twi_Stop()		  TWCR=(TWCR&TWCR_CMD_MASK)|(1<<TWINT)|(1<<TWEA)|(1<<TWSTO)
//����жϱ�־λ���������Ϸ�����ʼ�źţ�����TWI���ܣ�����TWI�ж�    ע���Ƿ��Զ�����ACK ��TWEA��
#define Twi_Start()		  TWCR=(TWCR&TWCR_CMD_MASK)|(1<<TWINT)|(1<<TWSTA)
//���ñ�����ַ(�ӻ���ʽ)
#define Twi_SetLocalDeviceAddr(deviceAddr, genCallEn)   TWAR=((deviceAddr)&0xFE)|((genCallEn)&0x01)
//��������:��������״̬
#define Twi_GetState()    Twi_State


//-----------4��I2���߹��ú���, �ɹ�����I2���������ĳ������--------------

void  i2c_start(void);	    //�������𶯿�ʼ����
unsigned char i2c_write(unsigned char a);	//��һ���ֽ�������������, ����TWI״̬
unsigned char i2c_read(void);		//i2c��
void  i2c_stop(void);		//��������ֹͣ���� 
unsigned char i2c_write_addr(unsigned char addr,unsigned char r_w);
unsigned char i2c_write_data(unsigned char data);
//------------------------------------------------------------------------
//���͸�ָ���ӻ�һ������
//addrΪ�ӻ���ַ��data����
//#include "Device.c"
#endif
