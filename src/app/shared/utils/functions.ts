import { IonContent } from "@ionic/angular";

export const trackById = (_: number, item: any): number => {
  return item?.id ?? item;
}

export const errorImage = (event): void => {
  event.target.src = '../../../../assets/images/image_not_found.png';
}

export const isNotEmptyObject = (object: any): boolean => {
  return Object.keys(object || {})?.length > 0 ? true : false
}

export const gotToTop = (content: IonContent): void => {
  content.scrollToTop(500);
}

export const getLastNumber = (number: number) => {
  return Number(number?.toString()?.slice(-1)) || 0;
}

export const sliceText = (text: string, length: number): string => {
  return text?.length > length ? (text || '')?.slice(0, length) + '...': text;
}

export const capitalizerText = (text: string): string => {
  const [ firstCharacter = null, ...rest ] = text?.split('') || [];
  return [
    ...(firstCharacter ? [ firstCharacter?.toLocaleUpperCase() ] : []),
    ...(rest || [])?.map(item => item?.toLocaleLowerCase())
  ]?.join('');
}

export const municipalities: string[] = ['VITORIA-GASTEIZ', 'DONOSTIA/SAN SEBASTIÁN', 'BILBAO', 'ERRENTERIA', 'ARETXABALETA', 'MUSKIZ', 'IRUN', 'EIBAR', 'AZKOITIA', 'GALDAKAO', 'BARAKALDO', 'GALDAMES', 'ERANDIO', 'ZUMARRAGA', 'LAUDIO/LLODIO', 'URNIETA', 'MARKINA-XEMEIN', 'ARRASATE/MONDRAGON', 'PASAIA', 'PORTUGALETE', 'AMOREBIETA-ETXANO'];

export const appColors = {
  0:'#8F98FF',
  1:'#FB774D',
  2:'#4DC590',
  3:'#3C396E',
  4:'#E74C3C',
  5:'#B7B7B7',
  6:'#6C3483',
  7:'#C383E1',
  8:'#2874A6',
  9:'#1ABC9C',
}

export enum EntityStatus {
  Initial = 'initial',
  Pending = 'pending',
  Loaded = 'loaded',
  Error = 'error'
};
