interface Func<T> {
    (): T;
}

interface Action {
    (): void;
}

interface ActionT1<T> {
    (value: T): void;
}