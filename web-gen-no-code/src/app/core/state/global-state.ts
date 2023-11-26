import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Một lớp cơ sở để quản lý trạng thái chia sẻ bằng cách sử dụng các Observable của RxJS.
 *
 * @template T Loại trạng thái đang được quản lý.
 */
export abstract class SharedState<T> {
  /**
   * Subject chứa trạng thái hiện tại và thông báo cho người đăng ký về các thay đổi trạng thái.
   */
  private coreState!: BehaviorSubject<T | null>;
  /**
   * Giá trị hiện tại của trạng thái đang được quản lý.
   */
  protected stateValue: T | null = null;

  constructor(initialState: T | null = null) {
    this.setInitialState(initialState);
  }

  setInitialState = (initialState: T | null = null) => {
    this.coreState = new BehaviorSubject<T | null>(initialState);
    this.stateValue = initialState;
  }

  /**
   * Lấy một Observable phát ra trạng thái hiện tại mỗi khi có sự thay đổi.
   *
   * @returns Một Observable phát ra trạng thái hiện tại.
   */
  getState = (): Observable<T | null> => {
    return this.coreState.asObservable();
  }

  /**
   * Lấy giá trị trạng thái hiện tại.
   *
   * @returns Giá trị trạng thái hiện tại.
   */
  getCurrentValue = (): T | null => {
    return this.stateValue;
  }

  /**
   * Đặt giá trị trạng thái mà không thông báo cho người đăng ký.
   * Để cập nhật trạng thái và thông báo cho người đăng ký, hãy sử dụng `setState()`.
   *
   * @param state Giá trị trạng thái mới để đặt.
   */
  setState(state: T | null): void {
    this.stateValue = state;
  };

  /**
   * Thông báo cho người đăng ký về một trạng thái mới bằng cách phát ra giá trị trạng thái hiện tại.
   */
  pushStateToSubscriber() {
    this.coreState.next(this.stateValue);
  };

  /**
   * Kiểm tra trạng thái hiện tại của state
   * @returns boolean
   */
  isEmpty = (): boolean => {
    return this.setState === null;
  }
}
