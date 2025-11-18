"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

const DEFAULT_DEFINITION = `graph TD
    Start(["开始订单流程"]) --> CreateOrder[创建订单]
    CreateOrder --> CheckStock{检查库存}
    CheckStock -- 有库存 --> Payment[支付订单]
    CheckStock -- 缺货 --> Notify[通知缺货]
    Notify --> Cancel[取消订单]
    Payment --> ProcessPayment{支付成功?}
    ProcessPayment -- 成功 --> Ship[安排发货]
    ProcessPayment -- 失败 --> Retry[重试支付]
    Retry --> ProcessPayment
    Ship --> Deliver[配送商品]
    Deliver --> Confirm[确认收货]
    Confirm --> Complete([订单完成])
    Cancel --> End([流程结束])
    Complete --> End

    %% 样式定义
    classDef startEnd fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef process fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef decision fill:#fff3e0,stroke:#e65100,stroke-width:2px
    
    class Start,End startEnd
    class CreateOrder,Payment,Notify,Ship,Deliver,Confirm,Retry process
    class CheckStock,ProcessPayment decision
`;

export interface MermaidHistoryEntry {
    id: string;
    definition: string;
    summary?: string;
    createdAt: number;
}

interface MermaidContextValue {
    definition: string;
    history: MermaidHistoryEntry[];
    updateDefinition: (definition: string, summary?: string) => void;
    setDefinition: (definition: string) => void;
    clearDefinition: () => void;
    initialDefinition: string;
}

const MermaidContext = createContext<MermaidContextValue | undefined>(
    undefined
);

function createHistoryEntry(
    definition: string,
    summary?: string
): MermaidHistoryEntry {
    const id =
        typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    return {
        id,
        definition,
        summary,
        createdAt: Date.now(),
    };
}

export function MermaidProvider({ children }: { children: React.ReactNode }) {
    const [definition, setDefinitionState] = useState(DEFAULT_DEFINITION);
    const [history, setHistory] = useState<MermaidHistoryEntry[]>(() => [
        createHistoryEntry(DEFAULT_DEFINITION, "Initial sample diagram"),
    ]);

    const updateDefinition = useCallback(
        (nextDefinition: string, summary?: string) => {
            if (!nextDefinition.trim()) return;
            setDefinitionState(nextDefinition);
            setHistory((prev) => [
                ...prev,
                createHistoryEntry(nextDefinition, summary),
            ]);
        },
        []
    );

    const setDefinition = useCallback((nextDefinition: string) => {
        setDefinitionState(nextDefinition);
    }, []);

    const clearDefinition = useCallback(() => {
        setDefinitionState(DEFAULT_DEFINITION);
        setHistory([
            createHistoryEntry(DEFAULT_DEFINITION, "Diagram reset"),
        ]);
    }, []);

    const value = useMemo(
        () => ({
            definition,
            history,
            updateDefinition,
            setDefinition,
            clearDefinition,
            initialDefinition: DEFAULT_DEFINITION,
        }),
        [definition, history, updateDefinition, setDefinition, clearDefinition]
    );

    return (
        <MermaidContext.Provider value={value}>
            {children}
        </MermaidContext.Provider>
    );
}

export function useMermaid() {
    const context = useContext(MermaidContext);
    if (!context) {
        throw new Error("useMermaid must be used within a MermaidProvider");
    }
    return context;
}
