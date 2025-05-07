import { useState, useEffect, useRef } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

interface BookingPopupProps {
  open: boolean;
  onClose: () => void;
}

interface FormErrors {
  date?: string;
  time?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

const BookingPopup = ({ open, onClose }: BookingPopupProps) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState(2);
  const prevGuests = useRef(guests);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    prevGuests.current = guests;
  }, [guests]);

  const resetForm = () => {
    setDate('');
    setTime('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setGuests(2);
    setErrors({});
    setShowError(false);
    setErrorMessage('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Валидация даты
    if (!date || date.length !== 10) {
      newErrors.date = 'Введите корректную дату';
    } else {
      const [dayStr, monthStr, yearStr] = date.split('.');
      const day = parseInt(dayStr, 10);
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);
      const dateObj = new Date(year, month - 1, day);
      // Проверка существования даты и что она не раньше сегодняшнего дня
      const isValidDate =
        dateObj.getFullYear() === year &&
        dateObj.getMonth() === month - 1 &&
        dateObj.getDate() === day;
      const today = new Date();
      today.setHours(0,0,0,0);
      if (!isValidDate || dateObj < today) {
        newErrors.date = 'Введите корректную дату в будущем';
      }
    }

    // Валидация времени
    if (!time || time.length !== 5) {
      newErrors.time = 'Введите корректное время';
    } else {
      const [hours, minutes] = time.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        newErrors.time = 'Введите корректное время';
      }
    }

    // Валидация имени
    if (!firstName || firstName.length < 2) {
      newErrors.firstName = 'Имя должно содержать минимум 2 символа';
    }

    // Валидация фамилии
    if (!lastName || lastName.length < 2) {
      newErrors.lastName = 'Фамилия должна содержать минимум 2 символа';
    }

    // Валидация телефона
    if (!phone || phone.length !== 11) {
      newErrors.phone = 'Введите корректный номер телефона';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (showSuccess) {
      timer = setTimeout(() => setShowSuccess(false), 2500);
    }
    return () => clearTimeout(timer);
  }, [showSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowSuccess(true);
      resetForm();
      onClose();
    } else {
      setErrorMessage('Пожалуйста, исправьте ошибки в форме');
      setShowError(true);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    
    // Форматирование даты
    if (value.length > 2) {
      value = value.slice(0, 2) + '.' + value.slice(2);
    }
    if (value.length > 5) {
      value = value.slice(0, 5) + '.' + value.slice(5);
    }
    
    setDate(value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    
    // Форматирование времени
    if (value.length > 2) {
      value = value.slice(0, 2) + ':' + value.slice(2);
    }
    
    setTime(value);
  };

  // Валидация
  const handleNameChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ-]/g, '');
    setter(value);
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    setPhone(value);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {open && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ 
                type: "spring",
                duration: 0.5,
                bounce: 0.2
              }}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative"
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
                onClick={handleClose}
                aria-label="Закрыть"
              >
                <Cross2Icon width={24} height={24} />
              </motion.button>
              <h2 className="text-2xl font-medium mb-6 text-center">Забронировать стол</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">Дата</span>
                  <input
                    type="text"
                    placeholder="ДД.ММ.ГГГГ"
                    className={`border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-gray-400`}
                    value={date}
                    onChange={handleDateChange}
                    maxLength={10}
                  />
                  {errors.date && <span className="text-sm text-red-500">{errors.date}</span>}
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">Время</span>
                  <input
                    type="text"
                    placeholder="ЧЧ:ММ"
                    className={`border ${errors.time ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-gray-400`}
                    value={time}
                    onChange={handleTimeChange}
                    maxLength={5}
                  />
                  {errors.time && <span className="text-sm text-red-500">{errors.time}</span>}
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">Имя</span>
                  <input
                    type="text"
                    placeholder="Имя"
                    className={`border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-gray-400`}
                    value={firstName}
                    onChange={handleNameChange(setFirstName)}
                  />
                  {errors.firstName && <span className="text-sm text-red-500">{errors.firstName}</span>}
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">Фамилия</span>
                  <input
                    type="text"
                    placeholder="Фамилия"
                    className={`border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-gray-400`}
                    value={lastName}
                    onChange={handleNameChange(setLastName)}
                  />
                  {errors.lastName && <span className="text-sm text-red-500">{errors.lastName}</span>}
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">Телефон</span>
                  <input
                    type="text"
                    placeholder="89999999999"
                    className={`border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-gray-400`}
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={11}
                  />
                  {errors.phone && <span className="text-sm text-red-500">{errors.phone}</span>}
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">Количество гостей</span>
                  <div className="flex flex-row items-center justify-center gap-3 mt-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      className="w-8 h-8 rounded bg-gray-100 text-xl flex items-center justify-center hover:bg-gray-200"
                      onClick={() => setGuests(g => Math.max(1, g - 1))}
                      tabIndex={-1}
                    >
                      -
                    </motion.button>
                    <input
                      type="text"
                      className="w-12 text-center border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white select-none"
                      value={guests}
                      readOnly
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      className="w-8 h-8 rounded bg-gray-100 text-xl flex items-center justify-center hover:bg-gray-200"
                      onClick={() => setGuests(g => Math.min(10, g + 1))}
                      tabIndex={-1}
                    >
                      +
                    </motion.button>
                  </div>
                </label>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="mt-4 bg-blue-100 text-blue-700 font-medium rounded-lg py-2 transition hover:bg-blue-200"
                >
                  Забронировать
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
        {/* Callout успешного бронирования */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              className="fixed left-8 bottom-12 z-40"
            >
              <div className="flex items-center gap-3 bg-green-100 text-green-800 rounded-xl px-4 py-3 text-base shadow-lg border border-green-200 max-w-sm w-fit">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#22C55E" fillOpacity="0.15"/><path d="M12 7v5l3 3" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="9" stroke="#22C55E" strokeWidth="2"/></svg>
                <span>Стол успешно забронирован!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatePresence>
      <AlertDialog.Root open={showError} onOpenChange={setShowError}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/40" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <AlertDialog.Title className="text-lg font-medium mb-2">
              Ошибка
            </AlertDialog.Title>
            <AlertDialog.Description className="text-gray-600 mb-4">
              {errorMessage}
            </AlertDialog.Description>
            <div className="flex justify-end">
              <AlertDialog.Cancel asChild>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Понятно
                </motion.button>
              </AlertDialog.Cancel>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
};

export default BookingPopup; 