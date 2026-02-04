import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpleadoService, IEmpleado, Turno } from '../services/empleado.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-horario',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './horario.component.html',
})
export class HorarioComponent implements OnInit {
  empleados = signal<IEmpleado[]>([]);
  currentMonth = signal(0);
  monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  /** calendario[empId][mes][día] = 'M'|'T'|'L' */
  private _schedule = signal<Record<string, Record<number, Record<number, Turno>>>>({});
  readonly schedule = computed(() => this._schedule());

  // Modal
  showModal = signal(false);
  selectedEmpId = signal<string | null>(null);
  selectedDay = signal<number | null>(null);
  selectedTurno = signal<Turno | ''>('');

  constructor(private empleadoService: EmpleadoService) { }

  ngOnInit(): void {
    this.empleadoService.getEmpleados()
      .then(res => {
        this.empleados.set(res.data);
        // construir schedule
        const init: Record<string, Record<number, Record<number, Turno>>> = {};
        res.data.forEach(emp => {
          const calArray = emp.calendario || [];
          const empSched: Record<number, Record<number, Turno>> = {};
          for (let m = 0; m < 12; m++) {
            const month = calArray[m]?.days || {};
            const daysRecord: Record<number, Turno> = {};
            Object.entries(month).forEach(([d, t]) => {
              const day = parseInt(d, 10);
              daysRecord[day] = t;
            });
            empSched[m] = daysRecord;
          }
          init[emp._id] = empSched;
        });
        this._schedule.set(init);
      })
      .catch(err => console.error('Error cargando empleados', err));
  }

  prevMonth(): void {
    if (this.currentMonth() > 0) this.currentMonth.update(m => m - 1);
  }
  nextMonth(): void {
    if (this.currentMonth() < 11) this.currentMonth.update(m => m + 1);
  }

  daysInMonth = computed(() => {
    const m = this.currentMonth();
    const days = new Date(2025, m + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  });

  openModal(empId: string, day: number): void {
    const m = this.currentMonth();
    const val = this.schedule()[empId][m][day] || '';
    this.selectedEmpId.set(empId);
    this.selectedDay.set(day);
    this.selectedTurno.set(val as Turno | '');
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  submitModal(): void {
    const empId = this.selectedEmpId();
    const day = this.selectedDay();
    const turno = this.selectedTurno();
    const mes = this.currentMonth();
    if (!empId || !day || !turno) return;

    // Llamada al backend
    this.empleadoService
      .updateEmpleadoCalendario(empId, mes, day, turno)
      .then(() => {
        // Actualiza localmente
        this._schedule.update(store => {
          const copy = { ...store };
          const empCal = { ...copy[empId] };
          const mesCal = { ...empCal[mes] };
          mesCal[day] = turno;
          empCal[mes] = mesCal;
          copy[empId] = empCal;
          return copy;
        });
      })
      .catch(err => console.error('Error guardando turno:', err));

    this.closeModal();
  }

  /** Devuelve un color según M, T o L */
  getBgColor(turno: Turno | ''): string {
    switch (turno) {
      case 'M': return '#cce5ff';  // amarillo suave
      case 'T': return '#fff3cd';  // azul suave
      case 'L': return '#d4edda';  // verde suave
      default: return 'transparent';
    }
  }

}
