import { PureComponent } from 'react';
import DynamicModule, { DynamicModuleProps } from './DynamicModule';


type DynamicModuleBoundaryState = {
    system: DynamicModuleProps['system'] & { compatModule?: string }
    compatibilityMode: boolean;
    hasError: boolean;
}

type DynamicModuleBoundaryProps = {
    system: DynamicModuleProps['system'] & { compatModule?: string }
} & { [k: string]: unknown };


export default class DynamicModuleBoundary extends PureComponent<DynamicModuleBoundaryProps, DynamicModuleBoundaryState> {

    constructor(props: DynamicModuleProps) {
        super(props);

        this.state = {
            hasError: false,
            compatibilityMode: false,
            system: props.system,
        };
    }

    componentDidCatch() {
        const { compatibilityMode, system: { scope, compatModule } } = this.state;
        if (!compatibilityMode && compatModule) {
            console.debug(`enter compat mode for app '${scope}'`);
            this.setState(state => ({
                ...state,
                system: {
                    ...state.system,
                    module: compatModule,
                }
            }));
            return;
        }
        this.setState({ hasError: true })
    }

    componentDidUpdate(prevProps: DynamicModuleBoundaryProps) {
        const { system } = this.props;
        if (prevProps.system.url !== system.url
            || prevProps.system.module !== system.module
            || prevProps.system.scope !== system.scope
            || prevProps.system.compatModule !== system.compatModule
        ) {
            this.setState(state => ({ ...state, compatibilityMode: false, hasError: false, system: this.props.system }));
        }
    }

    render() {
        if (this.state.hasError) {
            return null;
        }

        return (
            <DynamicModule {...this.props} system={this.state.system} />
        )
    }
}
