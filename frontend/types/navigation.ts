// types/navigation.ts

import { CallHistoryItem } from './history';


type Routine = {
  id: string;  // Remove the ? to make it required
  name: string;
  time: string;
  days: string[];
  enabled: boolean;
};

export type RootStackParamList = {
  Home: undefined;
  CustomCall: undefined;
  Routines: { newRoutine?: Omit<Routine, 'id'> };
  AddEditRoutine: AddEditRoutineScreenParams;
  History: undefined;
  Settings: undefined;
};


export type AddEditRoutineScreenParams = {
  routineId?: string;
  onSave?: (routine: Omit<Routine, 'id'>) => void;
};

export type { Routine };

// This allows us to use the navigation prop with proper type checking
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}