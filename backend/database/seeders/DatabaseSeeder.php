<?php

namespace Database\Seeders;

use App\Models\Ruche;
use App\Models\Rucher;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
            ],
        );

        $ruchers = [
            [
                'name' => 'Rucher des Tilleuls',
                'latitude' => 50.9513000,
                'longitude' => 1.8587000,
                'description' => 'Rucher principal situe pres des tilleuls, ideal pour suivre une activite dense.',
                'nb_emplacements' => 8,
                'ruches' => [
                    ['name' => 'Tilleul 01', 'statut' => 'active', 'type_ruche' => 'Dadant 10 cadres', 'annee_reine' => 2025, 'notes' => 'Colonie productive et calme.'],
                    ['name' => 'Tilleul 02', 'statut' => 'active', 'type_ruche' => 'Dadant 10 cadres', 'annee_reine' => 2024, 'notes' => 'A surveiller avant la prochaine miellee.'],
                    ['name' => 'Tilleul 03', 'statut' => 'en_observation', 'type_ruche' => 'Ruchette', 'annee_reine' => 2026, 'notes' => 'Jeune essaim en developpement.'],
                ],
            ],
            [
                'name' => 'Rucher du Verger',
                'latitude' => 50.9379000,
                'longitude' => 1.8892000,
                'description' => 'Emplacement proche des pommiers et poiriers, pratique pour la pollinisation.',
                'nb_emplacements' => 6,
                'ruches' => [
                    ['name' => 'Verger 01', 'statut' => 'active', 'type_ruche' => 'Warre', 'annee_reine' => 2024, 'notes' => 'Bonne reprise de ponte.'],
                    ['name' => 'Verger 02', 'statut' => 'inactive', 'type_ruche' => 'Dadant 12 cadres', 'annee_reine' => 2021, 'notes' => 'A remplacer ou reunir avec une colonie plus forte.'],
                    ['name' => 'Verger 03', 'statut' => 'active', 'type_ruche' => 'Dadant 10 cadres', 'annee_reine' => 2023, 'notes' => 'Reserve de nourriture correcte.'],
                ],
            ],
            [
                'name' => 'Rucher de la Dune',
                'latitude' => 50.9626000,
                'longitude' => 1.8425000,
                'description' => 'Rucher expose au vent, utile pour tester les alertes meteo et les colonies a surveiller.',
                'nb_emplacements' => 5,
                'ruches' => [
                    ['name' => 'Dune 01', 'statut' => 'en_observation', 'type_ruche' => 'Dadant 10 cadres', 'annee_reine' => 2022, 'notes' => 'Controle de la reine a prevoir.'],
                    ['name' => 'Dune 02', 'statut' => 'active', 'type_ruche' => 'Langstroth', 'annee_reine' => 2025, 'notes' => 'Colonie nerveuse mais reguliere.'],
                ],
            ],
            [
                'name' => 'Rucher Ecole',
                'latitude' => 50.9484000,
                'longitude' => 1.8741000,
                'description' => 'Rucher de demonstration avec plusieurs statuts pour tester les filtres du front.',
                'nb_emplacements' => 10,
                'ruches' => [
                    ['name' => 'Ecole 01', 'statut' => 'active', 'type_ruche' => 'Dadant 10 cadres', 'annee_reine' => 2026, 'notes' => 'Ruche utilisee pour les inspections accompagnees.'],
                    ['name' => 'Ecole 02', 'statut' => 'en_observation', 'type_ruche' => 'Ruchette', 'annee_reine' => 2025, 'notes' => 'Essaim recent, nourrissement leger.'],
                    ['name' => 'Ecole 03', 'statut' => 'inactive', 'type_ruche' => 'Warre', 'annee_reine' => 2020, 'notes' => 'Materiel a nettoyer avant remise en service.'],
                    ['name' => 'Ecole 04', 'statut' => 'active', 'type_ruche' => 'Langstroth', 'annee_reine' => 2024, 'notes' => 'Colonie pedagogique stable.'],
                ],
            ],
        ];

        foreach ($ruchers as $rucherData) {
            $ruches = $rucherData['ruches'];
            unset($rucherData['ruches']);

            $rucher = Rucher::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'name' => $rucherData['name'],
                ],
                $rucherData,
            );

            foreach ($ruches as $rucheData) {
                Ruche::updateOrCreate(
                    [
                        'rucher_id' => $rucher->id,
                        'name' => $rucheData['name'],
                    ],
                    $rucheData,
                );
            }
        }
    }
}
