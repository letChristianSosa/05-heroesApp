import { Component, OnInit } from '@angular/core';
import { Heroe, Publisher } from '../../interfaces/heroe.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [
    `
      .imagen {
        width: 100%;
        border-radius: 5px;
      }
    `,
  ],
})
export class AgregarComponent implements OnInit {
  publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics',
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics',
    },
  ];

  heroe: Heroe = {
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
    superhero: '',
    alt_img: undefined,
  };

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.router.url.includes('editar')) {
      this.activatedRoute.params
        .pipe(switchMap(({ id }) => this.heroesService.getHeroe(id)))
        .subscribe((heroe) => (this.heroe = heroe));
    }
  }

  agregar() {
    if (
      [
        this.heroe.superhero,
        this.heroe.alter_ego,
        this.heroe.alt_img,
        this.heroe.characters,
        this.heroe.first_appearance,
        this.heroe.publisher,
      ].includes('')
    ) {
      return;
    }

    if (this.heroe.id) {
      console.log('asdas');
      this.heroesService
        .actualizarHeroe(this.heroe)
        .subscribe(() => this.mostrarSnackBar('Heroe actualizado'));
      // this.router.navigate(['/heroes/listado']);
    } else {
      this.heroesService.agregarHeroe(this.heroe).subscribe((heroe) => {
        this.mostrarSnackBar('Heroe Creado');
        this.router.navigate([`/heroes/editar`, heroe.id]);
      });
    }
  }

  eliminar() {
    const dialog = this.dialog.open(ConfirmarComponent, {
      width: '300px',
      data: { ...this.heroe },
    });

    dialog.afterClosed().subscribe((res) => {
      if (res) {
        this.heroesService.borrarHeroe(this.heroe.id!).subscribe(() => {
          this.router.navigate(['/heroes/listado']);
        });
      }
    });
  }

  mostrarSnackBar(mensaje: string): void {
    this.snackBar.open(mensaje, 'ok!', {
      duration: 2500,
    });
  }
}
