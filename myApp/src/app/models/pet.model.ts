export interface Pet {
  id?: number;
  nome: string;
  especie: 'cachorro' | 'gato' | 'ave' | 'peixe' | 'reptil' | 'outro';
  raca: string;
  idade: number;
  peso: number;
  cliente_id: number;
  foto?: string;
  created_at?: string;
}

export interface PetComTutor extends Pet {
  tutor_nome?: string;
}
